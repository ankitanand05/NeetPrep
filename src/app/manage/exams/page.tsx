"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import { CalendarClock, ClipboardList, Loader2, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireRole } from "@/components/auth/RequireRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { deleteExamPaper, getExamPapers } from "@/features/exams";

export default function ManageExamsPage() {
  return (
    <RequireRole allow={["admin", "teacher"]}>
      <ManageExamsContent />
    </RequireRole>
  );
}

function ManageExamsContent() {
  const papers = useLiveQuery(getExamPapers, []);

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
              {papers.map((paper) => (
                <Card key={paper.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <p className="font-semibold">{paper.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">{paper.subjects.join(", ")}</Badge>
                        <span>{paper.questionIds.length} questions</span>
                        <span className="flex items-center gap-1">
                          <CalendarClock className="size-3.5" />
                          {new Date(paper.scheduledAt).toLocaleString()} · {paper.durationMinutes} min
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(paper.id)}
                      aria-label="Delete exam paper"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
