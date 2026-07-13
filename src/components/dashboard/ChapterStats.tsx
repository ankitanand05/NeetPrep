"use client";

import { CheckCircle2, Target, Clock, ListChecks } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { formatTime, formatPercent } from "@/lib/format";
import type { Subject } from "@/types";

export function ChapterStats({
  subject,
  chapter,
  questionCount,
}: {
  subject: Subject;
  chapter: string;
  questionCount: number;
}) {
  const progress = useChapterProgress(subject, chapter);
  const estimatedMin = Math.round((questionCount * 60) / 60);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard icon={ListChecks} label="Questions" value={String(questionCount)} accent="primary" />
      <StatCard icon={CheckCircle2} label="Completed" value={String(progress?.completed ?? 0)} accent="accent" />
      <StatCard icon={Target} label="Accuracy" value={formatPercent(progress?.accuracy ?? 0)} accent="success" />
      <StatCard
        icon={Clock}
        label="Avg / Est. Time"
        value={`${formatTime(progress?.avgTimeSec ?? 0)} / ${estimatedMin}m`}
        accent="warning"
      />
    </div>
  );
}
