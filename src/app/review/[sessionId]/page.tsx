"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ChevronLeft, ChevronRight, Bookmark, ArrowLeft, Lock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";
import { loadSession } from "@/features/practice";
import { getMergedQuestionsByIds } from "@/features/questions";
import { toggleBookmark } from "@/features/practice";
import { getBookmarkedIdSet } from "@/features/bookmarks";
import { formatTime } from "@/lib/format";
import { useAuthStore } from "@/store/auth";
import type { PracticeSession, Question } from "@/types";

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function ReviewPage() {
  const params = useParams<{ sessionId: string }>();
  const user = useAuthStore((s) => s.user);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const loaded = await loadSession(params.sessionId);
      if (!loaded) return;
      const qs = await getMergedQuestionsByIds(loaded.questionIds);
      setSession(loaded);
      setQuestions(qs);
      setBookmarkedIds(await getBookmarkedIdSet(loaded.questionIds));
    })();
  }, [params.sessionId]);

  async function handleToggleBookmark(questionId: string) {
    const nowBookmarked = await toggleBookmark(questionId);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (nowBookmarked) next.add(questionId);
      else next.delete(questionId);
      return next;
    });
  }

  if (!session || questions.length === 0) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  const isExamResultBlocked =
    session.mode === "exam" &&
    user?.role === "student" &&
    (session.studentUsername !== user.username || !session.resultPublished);

  if (isExamResultBlocked) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl">
          <EmptyState
            icon={Lock}
            title="Result not published yet"
            description="Your teacher hasn't released this exam's result. Check back later or ask your teacher/admin."
          />
        </div>
      </AppShell>
    );
  }

  const question = questions[index];
  const attempt = session.attempts[index];
  const isBookmarked = bookmarkedIds.has(question.id);
  const isCorrect = attempt.correct === true;
  const isWrong = attempt.correct === false;
  const isUngraded = question.correctAnswer === null && attempt.selectedOption !== null;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" render={<Link href={`/results/${session.id}`} />}>
            <ArrowLeft className="size-4" />
            Back to Results
          </Button>
          <span className="text-sm text-muted-foreground">
            Question {index + 1} of {questions.length}
          </span>
        </div>

        <Card>
          <CardContent className="space-y-5 p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{question.difficulty}</Badge>
                <Badge variant="secondary">{question.topic}</Badge>
                <Badge
                  className={isCorrect ? "bg-success text-success-foreground" : isWrong ? "bg-destructive text-destructive-foreground" : ""}
                  variant={isCorrect || isWrong ? undefined : "outline"}
                >
                  {isCorrect ? "Correct" : isWrong ? "Incorrect" : isUngraded ? "Ungraded" : "Skipped"}
                </Badge>
              </div>
              <button onClick={() => handleToggleBookmark(question.id)} aria-label="Toggle bookmark">
                <Bookmark className={cn("size-5", isBookmarked && "fill-primary text-primary")} />
              </button>
            </div>

            <p className="text-lg font-medium leading-relaxed">{question.question}</p>

            <div className="grid gap-2">
              {question.options.map((option, optIndex) => {
                const isCorrectAnswer = optIndex === question.correctAnswer;
                const isStudentAnswer = optIndex === attempt.selectedOption;
                return (
                  <div
                    key={optIndex}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
                      isCorrectAnswer && "border-success bg-success/10",
                      isStudentAnswer && !isCorrectAnswer && "border-destructive bg-destructive/10"
                    )}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                      {OPTION_LABELS[optIndex]}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isCorrectAnswer && <Badge className="bg-success text-success-foreground">Correct answer</Badge>}
                    {isStudentAnswer && !isCorrectAnswer && (
                      <Badge className="bg-destructive text-destructive-foreground">Your answer</Badge>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl bg-muted p-4 text-sm">
              <p className="mb-1 font-semibold">Explanation</p>
              <p className="text-muted-foreground">{question.solution}</p>
            </div>

            <p className="text-xs text-muted-foreground">Time taken: {formatTime(attempt.timeTakenSec)}</p>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <Button disabled={index === questions.length - 1} onClick={() => setIndex((i) => i + 1)}>
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
