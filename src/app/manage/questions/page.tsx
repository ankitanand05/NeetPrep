"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import { BookPlus, Loader2, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireRole } from "@/components/auth/RequireRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { QuestionForm } from "@/components/dashboard/QuestionForm";
import { useAuthStore } from "@/store/auth";
import { addCustomQuestion, deleteCustomQuestion, getCustomQuestions } from "@/features/questions";
import type { Question } from "@/types";

export default function ManageQuestionsPage() {
  return (
    <RequireRole allow={["admin", "teacher"]}>
      <ManageQuestionsContent />
    </RequireRole>
  );
}

function ManageQuestionsContent() {
  const user = useAuthStore((s) => s.user);
  const customQuestions = useLiveQuery(getCustomQuestions, []);

  async function handleAdd(question: Omit<Question, "id">) {
    if (!user) return;
    await addCustomQuestion(question, user.username);
    toast.success("Question added.");
  }

  async function handleDelete(id: string) {
    await deleteCustomQuestion(id);
    toast.success("Question deleted.");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Question Manager</h1>
          <p className="mt-1 text-muted-foreground">
            Add questions to any syllabus chapter. They become practiceable immediately.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Question</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionForm onSubmit={handleAdd} />
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Your Added Questions</h2>
          {customQuestions === undefined ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : customQuestions.length === 0 ? (
            <EmptyState icon={BookPlus} title="No custom questions yet" description="Questions you add will appear here." />
          ) : (
            <div className="grid gap-3">
              {customQuestions.map((q) => (
                <Card key={q.id}>
                  <CardContent className="flex items-start justify-between gap-3 p-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{q.subject}</Badge>
                        <Badge variant="secondary">{q.chapter}</Badge>
                        <Badge variant="outline">{q.difficulty}</Badge>
                      </div>
                      <p className="mt-2 truncate text-sm">{q.question}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive"
                      onClick={() => handleDelete(q.id)}
                      aria-label="Delete question"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
