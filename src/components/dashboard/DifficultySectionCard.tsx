import Link from "next/link";
import { Zap, Flame, Trophy, Lock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChapterProgressBadge } from "@/components/dashboard/ChapterProgressBadge";
import { subjectToSlug } from "@/constants/subjects";
import { chapterToSlug } from "@/features/questions";
import {
  DIFFICULTY_COLORS,
  DIFFICULTY_ICON_CLASSES,
  DIFFICULTY_RING_CLASSES,
  DIFFICULTY_DESCRIPTIONS,
  difficultyToSlug,
} from "@/constants/difficulty";
import { PRACTICE_SET_SIZE } from "@/constants/practice";
import { cn } from "@/lib/utils";
import type { Difficulty, Subject } from "@/types";

const DIFFICULTY_ICON: Record<Difficulty, typeof Zap> = {
  Easy: Zap,
  Medium: Flame,
  Hard: Trophy,
};

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
  const Icon = DIFFICULTY_ICON[difficulty];
  const locked = count === 0;
  const numSets = Math.ceil(count / PRACTICE_SET_SIZE);

  const card = (
    <Card
      className={cn(
        "border-border/60 transition-all",
        locked ? "opacity-60" : `hover:shadow-md hover:-translate-y-0.5 ${DIFFICULTY_RING_CLASSES[difficulty]}`
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
            <ChapterProgressBadge subject={subject} chapter={chapter} difficulty={difficulty} count={count} />
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
              <span className="text-muted-foreground">
                {numSets} set{numSets === 1 ? "" : "s"} · up to {PRACTICE_SET_SIZE} Qs each
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  if (locked) return card;

  return (
    <Link href={`/subjects/${subjectToSlug(subject)}/${chapterToSlug(chapter)}/${difficultyToSlug(difficulty)}`}>
      {card}
    </Link>
  );
}
