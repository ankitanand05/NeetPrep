import { db } from "@/services/db";
import { getQuestionsForChapter } from "@/features/questions";
import type { Subject } from "@/types";

export interface ChapterProgress {
  completed: number;
  correct: number;
  accuracy: number;
  avgTimeSec: number;
}

export async function getChapterProgress(subject: Subject, chapter: string): Promise<ChapterProgress> {
  const questions = getQuestionsForChapter(subject, chapter);
  const ids = new Set(questions.map((q) => q.id));
  const completedRows = (await db.completedQuestions.toArray()).filter((row) => ids.has(row.questionId));

  const completed = completedRows.length;
  const correct = completedRows.filter((r) => r.correct).length;
  const totalTime = completedRows.reduce((sum, r) => sum + r.timeTakenSec, 0);

  return {
    completed,
    correct,
    accuracy: completed > 0 ? (correct / completed) * 100 : 0,
    avgTimeSec: completed > 0 ? totalTime / completed : 0,
  };
}

export interface OverallStats {
  totalCompleted: number;
  totalCorrect: number;
  accuracy: number;
  avgTimeSec: number;
  currentStreak: number;
  longestStreak: number;
}

export async function getOverallStats(): Promise<OverallStats> {
  const [completedRows, streak] = await Promise.all([
    db.completedQuestions.toArray(),
    db.streaks.get("current"),
  ]);

  const totalCompleted = completedRows.length;
  const totalCorrect = completedRows.filter((r) => r.correct).length;
  const totalTime = completedRows.reduce((sum, r) => sum + r.timeTakenSec, 0);

  return {
    totalCompleted,
    totalCorrect,
    accuracy: totalCompleted > 0 ? (totalCorrect / totalCompleted) * 100 : 0,
    avgTimeSec: totalCompleted > 0 ? totalTime / totalCompleted : 0,
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
  };
}
