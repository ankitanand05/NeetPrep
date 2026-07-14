"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import { BarChart3, CalendarClock, ClipboardList, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireRole } from "@/components/auth/RequireRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { deleteExamPaper, getExamPapers } from "@/features/exams";
import type { ExamPaper } from "@/types";

function getStatus(paper: ExamPaper, now: number): { label: string; className: string } {
  if (now < paper.scheduledAt) {
    return { label: "Scheduled", className: "bg-primary/10 text-primary border-primary/20" };
  }
  if (now < paper.scheduledAt + paper.durationMinutes * 60_000) {
    return { label: "Live", className: "bg-success/10 text-success border-success/20" };
  }
  return { label: "Closed", className: "bg-muted text-muted-foreground" };
}

export default function ManageExamsPage() {
  return (
    <RequireRole allow={["admin", "teacher"]}>
      <ManageExamsContent />
    </RequireRole>
  );
}

function ManageExamsContent() {
  const papers = useLiveQuery(getExamPapers, []);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  async function handleDelete(id: string) {
    await deleteExamPaper(id);
    toast.success("Exam paper deleted.");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Exam Manager</h1>
            <p className="mt-1 text-muted-foreground">Build and publish scheduled exam papers for students.</p>
          </div>
          <Button render={<Link href="/manage/exams/new" />}>
            <Plus className="size-4" />
            Create Exam
          </Button>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Published Exam Papers</h2>
          {papers === undefined ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : papers.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No exam papers yet"
              description="Create one to get started — students will see it once published."
            />
          ) : (
            <div className="grid gap-3">
              {papers.map((paper) => {
                const status = getStatus(paper, now);
                return (
                  <Card key={paper.id}>
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{paper.title}</p>
                          <Badge variant="outline" className={status.className}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">{paper.subjects.join(", ")}</Badge>
                          <span>{paper.questionIds.length} questions</span>
                          <span className="flex items-center gap-1">
                            <CalendarClock className="size-3.5" />
                            {new Date(paper.scheduledAt).toLocaleString()} · {paper.durationMinutes} min
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" render={<Link href={`/manage/exams/${paper.id}/results`} />}>
                          <BarChart3 className="size-4" />
                          Results
                        </Button>
                        <Button variant="outline" size="sm" render={<Link href={`/manage/exams/${paper.id}/edit`} />}>
                          <Pencil className="size-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(paper.id)}
                          aria-label="Delete exam paper"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-center">
          <Button variant="ghost" render={<Link href="/exams" />}>
            View student-facing Exams page
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
