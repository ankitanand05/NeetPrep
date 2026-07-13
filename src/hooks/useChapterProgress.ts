"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getChapterProgress } from "@/features/progress";
import type { Difficulty, Subject } from "@/types";

export function useChapterProgress(subject: Subject, chapter: string, difficulty?: Difficulty) {
  return useLiveQuery(
    () => getChapterProgress(subject, chapter, difficulty),
    [subject, chapter, difficulty],
    {
      completed: 0,
      correct: 0,
      accuracy: 0,
      avgTimeSec: 0,
    }
  );
}
