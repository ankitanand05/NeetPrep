import Dexie, { type EntityTable } from "dexie";
import type {
  AppSettings,
  Bookmark,
  CompletedQuestion,
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
  }
}

export const db = new NeetDB();
