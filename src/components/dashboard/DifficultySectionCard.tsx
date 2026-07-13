"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Zap, Flame, Trophy, PlayCircle, Timer, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { createPracticeSession, saveSession } from "@/features/practice";
import { getQuestionsForChapter } from "@/features/questions";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  DIFFICULTY_COLORS,
  DIFFICULTY_ICON_CLASSES,
  DIFFICULTY_RING_CLASSES,
  DIFFICULTY_DESCRIPTIONS,
} from "@/constants/difficulty";
import type { Difficulty, Subject } from "@/types";

const DIFFICULTY_ICON: Record<Difficulty, typeof Zap> = {
  Easy: Zap,
  Medium: Flame,
  Hard: Trophy,
};

const TIME_PER_QUESTION_SEC = 60;

export function DifficultySectionCard({
  subject,
  chapter,
  difficulty,
  count,
}: {
  subject: Subject;
  chapter: string;
  difficulty: Difficulty;
  count: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"practice" | "timed" | null>(null);
  const progress = useChapterProgress(subject, chapter, difficulty);
  const Icon = DIFFICULTY_ICON[difficulty];
  const locked = count === 0;

  async function start(mode: "practice" | "timed") {
    setLoading(mode);
    try {
      const questions = getQuestionsForChapter(subject, chapter).filter((q) => q.difficulty === difficulty);
      if (questions.length === 0) {
        toast.info(`No ${difficulty.toLowerCase()} questions in this chapter yet.`);
        return;
      }
      const session = createPracticeSession({
        subject,
        chapter,
        mode: mode === "timed" ? "timed" : "practice",
        questions,
        shuffleQuestions: true,
        timeLimitSec: mode === "timed" ? questions.length * TIME_PER_QUESTION_SEC : null,
      });
      await saveSession(session);
      router.push(`/practice/${session.id}`);
    } finally {
      setLoading(null);
    }
  }

  const completed = progress?.completed ?? 0;
  const percentDone = count > 0 ? (completed / count) * 100 : 0;

  return (
    <Card
      className={cn(
        "border-border/60 transition-all",
        locked ? "opacity-60" : `hover:shadow-md ${DIFFICULTY_RING_CLASSES[difficulty]}`
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className={cn("flex size-10 items-center justify-center rounded-xl", DIFFICULTY_ICON_CLASSES[difficulty])}>
            <Icon className="size-5" />
          </div>
          <Badge variant="outline" className={DIFFICULTY_COLORS[difficulty]}>
            {count} {count === 1 ? "Q" : "Qs"}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg">{difficulty}</CardTitle>
        <p className="text-sm text-muted-foreground">{DIFFICULTY_DESCRIPTIONS[difficulty]}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {locked ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4" />
            Coming soon
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {completed}/{count} done
                </span>
                <span>{formatPercent(progress?.accuracy ?? 0)} accuracy</span>
              </div>
              <Progress value={percentDone} />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" disabled={loading !== null} onClick={() => start("practice")}>
                <PlayCircle className="size-4" />
                {loading === "practice" ? "Loading…" : "Practice"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={loading !== null}
                onClick={() => start("timed")}
              >
                <Timer className="size-4" />
                {loading === "timed" ? "Loading…" : "Timed"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
