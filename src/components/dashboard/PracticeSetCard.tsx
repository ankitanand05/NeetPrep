"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlayCircle, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createPracticeSession, saveSession } from "@/features/practice";
import { getMergedQuestionsForChapter } from "@/features/questions";
import { PRACTICE_SET_SIZE } from "@/constants/practice";
import type { Difficulty, Subject } from "@/types";

const TIME_PER_QUESTION_SEC = 60;

export function PracticeSetCard({
  subject,
  chapter,
  difficulty,
  setIndex,
  setCount,
}: {
  subject: Subject;
  chapter: string;
  difficulty: Difficulty;
  setIndex: number;
  setCount: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"practice" | "timed" | null>(null);

  async function start(mode: "practice" | "timed") {
    setLoading(mode);
    try {
      const chapterQuestions = await getMergedQuestionsForChapter(subject, chapter);
      const difficultyQuestions = chapterQuestions.filter((q) => q.difficulty === difficulty);
      const startIndex = setIndex * PRACTICE_SET_SIZE;
      const setQuestions = difficultyQuestions.slice(startIndex, startIndex + PRACTICE_SET_SIZE);

      if (setQuestions.length === 0) {
        toast.info("This practice set is no longer available.");
        return;
      }

      const session = createPracticeSession({
        subject,
        chapter,
        mode: mode === "timed" ? "timed" : "practice",
        questions: setQuestions,
        shuffleQuestions: true,
        timeLimitSec: mode === "timed" ? setQuestions.length * TIME_PER_QUESTION_SEC : null,
      });
      await saveSession(session);
      router.push(`/practice/${session.id}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card className="border-border/60 transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Practice Set {setIndex + 1}</CardTitle>
          <Badge variant="outline">
            {setCount} {setCount === 1 ? "Q" : "Qs"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button className="flex-1" disabled={loading !== null} onClick={() => start("practice")}>
          <PlayCircle className="size-4" />
          {loading === "practice" ? "Loading…" : "Practice"}
        </Button>
        <Button variant="outline" className="flex-1" disabled={loading !== null} onClick={() => start("timed")}>
          <Timer className="size-4" />
          {loading === "timed" ? "Loading…" : "Timed"}
        </Button>
      </CardContent>
    </Card>
  );
}
