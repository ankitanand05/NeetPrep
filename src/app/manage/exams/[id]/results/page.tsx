"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireRole } from "@/components/auth/RequireRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { getExamAttempts, getExamPaper, publishResult, unpublishResult } from "@/features/exams";
import { computeSummary } from "@/features/practice";
import { getMergedQuestionsByIds } from "@/features/questions";
import { formatPercent } from "@/lib/format";
import type { ExamPaper, PracticeSession, SessionSummary } from "@/types";

export default function ExamResultsPage() {
  return (
    <RequireRole allow={["admin", "teacher"]}>
      <ExamResultsContent />
    </RequireRole>
  );
}

interface AttemptRow {
  session: PracticeSession;
  summary: SessionSummary | null;
}

function ExamResultsContent() {
  const params = useParams<{ id: string }>();
  const [paper, setPaper] = useState<ExamPaper | null>(null);
  const [rows, setRows] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  async function load() {
    setLoading(true);
    try {
      const loadedPaper = await getExamPaper(params.id);
      if (!loadedPaper) return;
      setPaper(loadedPaper);
      const attempts = await getExamAttempts(params.id);
      const withSummaries = await Promise.all(
        attempts.map(async (session) => {
          if (session.status !== "submitted") return { session, summary: null };
          const questions = await getMergedQuestionsByIds(session.questionIds);
          return { session, summary: computeSummary(session, questions) };
        })
      );
      setRows(withSummaries);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  async function handleTogglePublish(session: PracticeSession) {
    if (session.resultPublished) {
      await unpublishResult(session.id);
      toast.success("Result hidden from student.");
    } else {
      await publishResult(session.id);
      toast.success("Result published to student.");
    }
    await load();
  }

  function statusFor(session: PracticeSession): { label: string; className: string } {
    if (session.status === "submitted") {
      return { label: "Submitted", className: "bg-success/10 text-success border-success/20" };
    }
    if (paper && now > paper.scheduledAt + paper.durationMinutes * 60_000) {
      return { label: "Expired", className: "bg-destructive/10 text-destructive border-destructive/20" };
    }
    if (session.status === "in_progress" || session.status === "paused") {
      return { label: "In Progress", className: "bg-warning/10 text-warning border-warning/20" };
    }
    return { label: "Not Started", className: "" };
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  if (!paper) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
          Exam paper not found.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <Button variant="ghost" render={<Link href="/manage/exams" />} className="mb-2">
            <ArrowLeft className="size-4" />
            Back to Exam Manager
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{paper.title} — Results</h1>
          <p className="mt-1 text-muted-foreground">
            {paper.questionIds.length} questions · {paper.durationMinutes} min · Scheduled{" "}
            {new Date(paper.scheduledAt).toLocaleString()}
          </p>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No attempts yet"
            description="Once a student starts this exam, their attempt will show up here."
          />
        ) : (
          <div className="grid gap-3">
            {rows.map(({ session, summary }) => {
              const status = statusFor(session);
              return (
                <Card key={session.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <p className="font-semibold">{session.studentUsername}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className={status.className}>
                          {status.label}
                        </Badge>
                        {summary && (
                          <span>
                            {summary.correct}/{summary.total} · {formatPercent(summary.accuracy)}
                          </span>
                        )}
                        {session.submittedAt && <span>{new Date(session.submittedAt).toLocaleString()}</span>}
                      </div>
                    </div>
                    {session.status === "submitted" && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" render={<Link href={`/results/${session.id}`} />}>
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant={session.resultPublished ? "outline" : "default"}
                          onClick={() => handleTogglePublish(session)}
                        >
                          {session.resultPublished ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          {session.resultPublished ? "Unpublish" : "Publish Result"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
