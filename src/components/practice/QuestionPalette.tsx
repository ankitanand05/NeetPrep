"use client";

import { cn } from "@/lib/utils";
import type { AttemptRecord } from "@/types";

const STATUS_CLASSES: Record<AttemptRecord["status"], string> = {
  unanswered: "bg-muted text-muted-foreground border-border",
  answered: "bg-success text-success-foreground border-success",
  skipped: "bg-warning text-warning-foreground border-warning",
  marked: "bg-accent text-accent-foreground border-accent",
};

interface QuestionPaletteProps {
  attempts: AttemptRecord[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function QuestionPalette({ attempts, currentIndex, onNavigate }: QuestionPaletteProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-2 md:grid-cols-5">
        {attempts.map((attempt, index) => (
          <button
            key={attempt.questionId}
            type="button"
            onClick={() => onNavigate(index)}
            className={cn(
              "flex size-9 items-center justify-center rounded-lg border text-xs font-semibold transition-all",
              STATUS_CLASSES[attempt.status],
              index === currentIndex && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <LegendItem colorClass="bg-success" label="Answered" />
        <LegendItem colorClass="bg-warning" label="Skipped" />
        <LegendItem colorClass="bg-accent" label="Marked" />
        <LegendItem colorClass="bg-muted border border-border" label="Unanswered" />
      </div>
    </div>
  );
}

function LegendItem({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-full", colorClass)} />
      {label}
    </div>
  );
}
