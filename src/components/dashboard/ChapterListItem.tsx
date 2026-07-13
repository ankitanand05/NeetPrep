"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { chapterToSlug } from "@/features/questions";
import { subjectToSlug } from "@/constants/subjects";
import { formatPercent } from "@/lib/format";
import type { ChapterMeta } from "@/types";

export function ChapterListItem({ chapter }: { chapter: ChapterMeta }) {
  const progress = useChapterProgress(chapter.subject, chapter.chapter);
  const completed = progress?.completed ?? 0;
  const hasQuestions = chapter.questionCount > 0;
  const pct = hasQuestions ? (completed / chapter.questionCount) * 100 : 0;

  return (
    <Link href={`/subjects/${subjectToSlug(chapter.subject)}/${chapterToSlug(chapter.chapter)}`}>
      <Card
        className={`border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md ${
          hasQuestions ? "" : "opacity-70"
        }`}
      >
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{chapter.chapter}</p>
              <Badge variant="outline" className="text-[10px]">
                Class {chapter.class}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{chapter.unit}</p>
            {hasQuestions ? (
              <div className="mt-3 flex items-center gap-3">
                <Progress value={pct} className="h-1.5 max-w-40" />
                <span className="text-xs text-muted-foreground">
                  {completed}/{chapter.questionCount} · {formatPercent(progress?.accuracy ?? 0)} acc.
                </span>
              </div>
            ) : (
              <Badge variant="secondary" className="mt-3 text-[10px]">
                Coming soon
              </Badge>
            )}
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}
