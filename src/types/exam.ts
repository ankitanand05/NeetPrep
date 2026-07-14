import type { Subject } from "./question";

export interface ExamPaper {
  id: string;
  title: string;
  subjects: Subject[];
  questionIds: string[];
  durationMinutes: number;
  /** Unix ms timestamp for when the exam is scheduled to be held. */
  scheduledAt: number;
  createdBy: string;
  createdAt: number;
}
