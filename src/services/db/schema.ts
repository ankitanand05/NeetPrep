import Dexie, { type EntityTable } from "dexie";
import type {
  AppSettings,
  Bookmark,
  CompletedQuestion,
  CustomQuestion,
  ExamPaper,
  PracticeSession,
  StreakData,
  WrongQuestion,
} from "@/types";

export class NeetDB extends Dexie {
  bookmarks!: EntityTable<Bookmark, "questionId">;
  completedQuestions!: EntityTable<CompletedQuestion, "questionId">;
  wrongQuestions!: EntityTable<WrongQuestion, "questionId">;
  practiceSessions!: EntityTable<PracticeSession, "id">;
  settings!: EntityTable<AppSettings, "id">;
  streaks!: EntityTable<StreakData, "id">;
  customQuestions!: EntityTable<CustomQuestion, "id">;
  examPapers!: EntityTable<ExamPaper, "id">;

  constructor() {
    super("neet-practice-db");
    this.version(1).stores({
      bookmarks: "questionId, createdAt",
      completedQuestions: "questionId, correct, timestamp, sessionId",
      wrongQuestions: "questionId, lastAttemptedAt",
      practiceSessions: "id, subject, chapter, mode, status, startedAt",
      settings: "id",
      streaks: "id",
    });
    this.version(2).stores({
      bookmarks: "questionId, createdAt",
      completedQuestions: "questionId, correct, timestamp, sessionId",
      wrongQuestions: "questionId, lastAttemptedAt",
      practiceSessions: "id, subject, chapter, mode, status, startedAt",
      settings: "id",
      streaks: "id",
      customQuestions: "id, subject, chapter, createdBy, createdAt",
      examPapers: "id, createdBy, createdAt",
    });
  }
}

export const db = new NeetDB();
