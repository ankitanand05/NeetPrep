export interface Bookmark {
  questionId: string;
  createdAt: number;
}

export interface CompletedQuestion {
  questionId: string;
  correct: boolean;
  timeTakenSec: number;
  timestamp: number;
  sessionId: string;
}

export interface WrongQuestion {
  questionId: string;
  lastAttemptedAt: number;
  timesWrong: number;
}

export interface StreakData {
  id: "current";
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string;
}

export interface AppSettings {
  id: "settings";
  theme: "light" | "dark" | "system";
  dailyGoal: number;
  targetScore: number;
  name: string;
}
