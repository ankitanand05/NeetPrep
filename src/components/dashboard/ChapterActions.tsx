"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PlayCircle, Timer, RotateCcw, XCircle, Bookmark as BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/services/db";
import { getQuestionsForChapter } from "@/features/questions";
import { createPracticeSession, saveSession } from "@/features/practice";
import type { PracticeMode, Question, Subject } from "@/types";

const TIME_PER_QUESTION_SEC = 60;

export function ChapterActions({ subject, chapter }: { subject: Subject; chapter: string }) {
  const router = useRouter();
  const [loadingMode, setLoadingMode] = useState<PracticeMode | null>(null);

  async function startSession(mode: PracticeMode) {
    setLoadingMode(mode);
    try {
      const chapterQuestions = getQuestionsForChapter(subject, chapter);
      let questions: Question[] = chapterQuestions;

      if (mode === "wrong") {
        const wrongIds = new Set((await db.wrongQuestions.toArray()).map((w) => w.questionId));
        questions = chapterQuestions.filter((q) => wrongIds.has(q.id));
        if (questions.length === 0) {
          toast.info("No wrong questions in this chapter yet.");
          return;
        }
      }

      if (mode === "bookmarks") {
        const bookmarkedIds = new Set((await db.bookmarks.toArray()).map((b) => b.questionId));
        questions = chapterQuestions.filter((q) => bookmarkedIds.has(q.id));
        if (questions.length === 0) {
          toast.info("No bookmarked questions in this chapter yet.");
          return;
        }
      }

      const session = createPracticeSession({
        subject,
        chapter,
        mode,
        questions,
        shuffleQuestions: mode === "practice" || mode === "timed",
        timeLimitSec: mode === "timed" ? questions.length * TIME_PER_QUESTION_SEC : null,
      });

      await saveSession(session);
      router.push(`/practice/${session.id}`);
    } finally {
      setLoadingMode(null);
    }
  }

  const buttons: { mode: PracticeMode; label: string; icon: typeof PlayCircle; variant?: "default" | "outline" }[] = [
    { mode: "practice", label: "Practice", icon: PlayCircle },
    { mode: "timed", label: "Timed Practice", icon: Timer, variant: "outline" },
    { mode: "revision", label: "Revision", icon: RotateCcw, variant: "outline" },
    { mode: "wrong", label: "Wrong Questions", icon: XCircle, variant: "outline" },
    { mode: "bookmarks", label: "Bookmarks", icon: BookmarkIcon, variant: "outline" },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {buttons.map((b) => (
        <Button
          key={b.mode}
          variant={b.variant ?? "default"}
          disabled={loadingMode !== null}
          onClick={() => startSession(b.mode)}
        >
          <b.icon className="size-4" />
          {loadingMode === b.mode ? "Loading…" : b.label}
        </Button>
      ))}
    </div>
  );
}
