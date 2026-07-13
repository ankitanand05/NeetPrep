"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { RotateCcw, XCircle, Bookmark as BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/services/db";
import { getQuestionsForChapter } from "@/features/questions";
import { createPracticeSession, saveSession } from "@/features/practice";
import type { PracticeMode, Question, Subject } from "@/types";

type HistoryMode = Extract<PracticeMode, "revision" | "wrong" | "bookmarks">;

export function ChapterActions({ subject, chapter }: { subject: Subject; chapter: string }) {
  const router = useRouter();
  const [loadingMode, setLoadingMode] = useState<HistoryMode | null>(null);

  async function startSession(mode: HistoryMode) {
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
      });

      await saveSession(session);
      router.push(`/practice/${session.id}`);
    } finally {
      setLoadingMode(null);
    }
  }

  const buttons: { mode: HistoryMode; label: string; icon: typeof RotateCcw }[] = [
    { mode: "revision", label: "Revision (All Questions)", icon: RotateCcw },
    { mode: "wrong", label: "Wrong Questions", icon: XCircle },
    { mode: "bookmarks", label: "Bookmarks", icon: BookmarkIcon },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {buttons.map((b) => (
        <Button
          key={b.mode}
          variant="outline"
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
