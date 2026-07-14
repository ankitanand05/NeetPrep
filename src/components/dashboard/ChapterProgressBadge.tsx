"use client";

import { Progress } from "@/components/ui/progress";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { formatPercent } from "@/lib/format";
import type { Difficulty, Subject } from "@/types";

export function ChapterProgressBadge({
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
  const progress = useChapterProgress(subject, chapter, difficulty);
  const completed = progress?.completed ?? 0;
  const percentDone = count > 0 ? (completed / count) * 100 : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {completed}/{count} done
        </span>
        <span>{formatPercent(progress?.accuracy ?? 0)} accuracy</span>
      </div>
      <Progress value={percentDone} />
    </div>
  );
}
