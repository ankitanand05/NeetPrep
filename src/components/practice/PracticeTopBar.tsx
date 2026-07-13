"use client";

import { useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { formatTime } from "@/lib/format";

interface PracticeTopBarProps {
  currentIndex: number;
  total: number;
  elapsedSec: number;
  timeLimitSec: number | null;
}

export function PracticeTopBar({ currentIndex, total, elapsedSec, timeLimitSec }: PracticeTopBarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const progressPct = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  const remaining = timeLimitSec !== null ? Math.max(0, timeLimitSec - elapsedSec) : null;

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }

  return (
    <div className="sticky top-0 z-20 border-b border-border/60 glass px-4 py-3 md:px-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">
            Q{currentIndex + 1} <span className="text-muted-foreground">/ {total}</span>
          </span>
          <Progress value={progressPct} className="h-1.5 w-24 md:w-40" />
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`font-mono text-sm font-medium tabular-nums ${
              remaining !== null && remaining < 30 ? "text-destructive" : ""
            }`}
          >
            {formatTime(remaining ?? elapsedSec)}
          </span>
          <Button variant="ghost" size="icon" className="size-9" onClick={toggleFullscreen} aria-label="Fullscreen">
            {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
