import type { Difficulty, Subject } from "./question";

export type PracticeMode = "practice" | "timed" | "revision" | "wrong" | "bookmarks";
export type QuestionStatus = "unanswered" | "answered" | "skipped" | "marked";

export interface AttemptRecord {
  questionId: string;
  selectedOption: number | null;
  status: QuestionStatus;
  timeTakenSec: number;
  correct: boolean | null;
}

export interface PracticeSession {
  id: string;
  subject: Subject;
  chapter: string;
  mode: PracticeMode;
  questionIds: string[];
  optionOrders: number[][];
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timeLimitSec: number | null;
  startedAt: number | null;
  submittedAt: number | null;
  status: "not_started" | "in_progress" | "paused" | "submitted";
  currentIndex: number;
  attempts: AttemptRecord[];
}

export interface SessionSummary {
  sessionId: string;
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  ungraded: number;
  accuracy: number;
  timeTakenSec: number;
  avgTimeSec: number;
  fastestQuestionId: string | null;
  slowestQuestionId: string | null;
  byDifficulty: Record<Difficulty, { total: number; correct: number }>;
  byTopic: Record<string, { total: number; correct: number }>;
}
