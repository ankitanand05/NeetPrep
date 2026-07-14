import type { Question, Subject } from "@/types";

import chemistryPeriodicTable from "./chemistry/periodic-table.json";

/**
 * Register every chapter JSON file here. Adding a new chapter later means:
 * 1. Drop the new JSON file under src/data/<subject>/.
 * 2. Add one import + one array entry below.
 * No other code changes are required — pages/loaders read from this manifest,
 * and the full chapter list (including chapters with 0 questions so far) comes
 * from src/constants/syllabus.ts.
 *
 * Only real, user-supplied question data belongs here — no placeholder content.
 */
export const CHAPTER_FILES: Record<Subject, Question[][]> = {
  Physics: [],
  Chemistry: [chemistryPeriodicTable as Question[]],
  Botany: [],
  Zoology: [],
};
