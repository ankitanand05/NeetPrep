"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import { BarChart3, CalendarClock, CheckCircle2, ClipboardList, Clock, Loader2, PlayCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { getExamPapers } from "@/features/exams";
import { getMergedQuestionsByIds } from "@/features/questions";
import { createPracticeSession, saveSession } from "@/features/practice";
import { useAuthStore } from "@/store/auth";
import { db } from "@/services/db";

export default function ExamsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isStaff = user?.role === "admin" || user?.role === "teacher";
  const papers = useLiveQuery(getExamPapers, []);
  const myAttempts = useLiveQuery(
    async () => {
      if (!user || isStaff) return [];
      return db.practiceSessions.where("studentUsername").equals(user.username).toArray();
    },
    [user?.username, isStaff],
    []
  );
  const [startingId, setStartingId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  async function handleStart(paperId: string) {
    if (!user) return;
    const paper = papers?.find((p) => p.id === paperId);
    if (!paper) return;

    setStartingId(paperId);
    try {
      const questions = await getMergedQuestionsByIds(paper.questionIds);
      if (questions.length === 0) {
        toast.error("This exam has no questions available anymore.");
        return;
      }
      const session = createPracticeSession({
        subject: paper.subjects.length === 1 ? paper.subjects[0] : "Mixed",
        chapter: paper.title,
        mode: "exam",
        questions,
        timeLimitSec: paper.durationMinutes * 60,
        examPaperId: paper.id,
        studentUsername: user.username,
      });
      await saveSession(session);
      router.push(`/practice/${session.id}`);
    } finally {
      setStartingId(null);
    }
  }

  function handleResume(sessionId: string) {
    router.push(`/practice/${sessionId}`);
  }

  // Students: once an exam's window has closed, drop it from the list unless
  // they're still actively mid-attempt (their own session timer can run a
  // little past the wall-clock window if they started right at the end).
  const visiblePapers = papers?.filter((paper) => {
    if (isStaff) return true;
    const attempt = myAttempts?.find((a) => a.examPaperId === paper.id);
    const isActive = attempt?.status === "in_progress" || attempt?.status === "paused";
    if (isActive) return true;
    const isExpired = now > paper.scheduledAt + paper.durationMinutes * 60_000;
    return !isExpired;
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Exams</h1>
          <p className="mt-1 text-muted-foreground">
            {isStaff
              ? "Exams you've published — jump to results and publish scores from here."
              : "Timed exam papers set by your teacher or admin."}
          </p>
        </div>

        {visiblePapers === undefined ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : visiblePapers.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No exams available yet"
            description={
              isStaff
                ? "Create one from Manage Exams to get started."
                : "Check back once your teacher or admin has published an exam paper."
            }
          />
        ) : (
          <div className="grid gap-4">
            {visiblePapers.map((paper) => {
              const isDue = now >= paper.scheduledAt;
              const isExpired = now > paper.scheduledAt + paper.durationMinutes * 60_000;

              let action: React.ReactNode;
              if (isStaff) {
                action = (
                  <Button render={<Link href={`/manage/exams/${paper.id}/results`} />}>
                    <BarChart3 className="size-4" />
                    View Results
                  </Button>
                );
              } else {
                const attempt = myAttempts?.find((a) => a.examPaperId === paper.id);
                if (attempt?.status === "submitted") {
                  action = (
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle2 className="size-3.5" />
                      Submitted
                    </Badge>
                  );
                } else if (attempt) {
                  action = (
                    <Button onClick={() => handleResume(attempt.id)}>
                      <PlayCircle className="size-4" />
                      Resume Exam
                    </Button>
                  );
                } else if (isExpired) {
                  action = (
                    <Button disabled>
                      <PlayCircle className="size-4" />
                      Expired
                    </Button>
                  );
                } else {
                  action = (
                    <Button disabled={!isDue || startingId !== null} onClick={() => handleStart(paper.id)}>
                      <PlayCircle className="size-4" />
                      {startingId === paper.id ? "Starting…" : isDue ? "Start Exam" : "Not yet available"}
                    </Button>
                  );
                }
              }

              return (
                <Card key={paper.id} className="border-border/60">
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <p className="font-semibold">{paper.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">{paper.subjects.join(", ")}</Badge>
                        <span>{paper.questionIds.length} questions</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {paper.durationMinutes} min
                        </span>
                      </div>
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarClock className="size-3.5" />
                        {isDue ? "Available now" : `Starts ${new Date(paper.scheduledAt).toLocaleString()}`}
                      </p>
                    </div>
                    {action}
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
