"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { getChapterProgress } from "@/features/progress";
import type { Subject } from "@/types";

export function useChapterProgress(subject: Subject, chapter: string) {
  return useLiveQuery(() => getChapterProgress(subject, chapter), [subject, chapter], {
    completed: 0,
    correct: 0,
    accuracy: 0,
    avgTimeSec: 0,
  });
}
