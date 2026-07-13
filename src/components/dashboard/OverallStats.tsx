"use client";

import { CheckCircle2, Target, Flame, Clock } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { useOverallStats } from "@/hooks/useOverallStats";
import { formatTime, formatPercent } from "@/lib/format";

export function OverallStats() {
  const stats = useOverallStats();

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard icon={CheckCircle2} label="Completed" value={String(stats?.totalCompleted ?? 0)} accent="primary" />
      <StatCard
        icon={Target}
        label="Accuracy"
        value={formatPercent(stats?.accuracy ?? 0)}
        accent="success"
      />
      <StatCard icon={Flame} label="Current Streak" value={`${stats?.currentStreak ?? 0} days`} accent="warning" />
      <StatCard icon={Clock} label="Avg Time / Q" value={formatTime(stats?.avgTimeSec ?? 0)} accent="accent" />
    </div>
  );
}
