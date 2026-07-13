"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getOverallStats } from "@/features/progress";

export function useOverallStats() {
  return useLiveQuery(getOverallStats, [], {
    totalCompleted: 0,
    totalCorrect: 0,
    accuracy: 0,
    avgTimeSec: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
}
