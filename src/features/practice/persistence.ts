import { db } from "@/services/db";
import type { PracticeSession, Question } from "@/types";

export async function saveSession(session: PracticeSession): Promise<void> {
  await db.practiceSessions.put(session);
}

export async function loadSession(sessionId: string): Promise<PracticeSession | undefined> {
  return db.practiceSessions.get(sessionId);
}

export async function recordSubmission(session: PracticeSession, questions: Question[]): Promise<void> {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const timestamp = Date.now();

  await db.transaction("rw", db.completedQuestions, db.wrongQuestions, async () => {
    for (const attempt of session.attempts) {
      if (attempt.status !== "answered" || attempt.selectedOption === null) continue;
      const question = questionMap.get(attempt.questionId);
      if (!question || question.correctAnswer === null) continue;

      await db.completedQuestions.put({
        questionId: attempt.questionId,
        correct: Boolean(attempt.correct),
        timeTakenSec: attempt.timeTakenSec,
        timestamp,
        sessionId: session.id,
      });

      if (!attempt.correct) {
        const existing = await db.wrongQuestions.get(attempt.questionId);
        await db.wrongQuestions.put({
          questionId: attempt.questionId,
          lastAttemptedAt: timestamp,
          timesWrong: (existing?.timesWrong ?? 0) + 1,
        });
      } else {
        await db.wrongQuestions.delete(attempt.questionId);
      }
    }
  });

  await updateStreak();
}

export async function toggleBookmark(questionId: string): Promise<boolean> {
  const existing = await db.bookmarks.get(questionId);
  if (existing) {
    await db.bookmarks.delete(questionId);
    return false;
  }
  await db.bookmarks.put({ questionId, createdAt: Date.now() });
  return true;
}

export async function isBookmarked(questionId: string): Promise<boolean> {
  return Boolean(await db.bookmarks.get(questionId));
}

async function updateStreak(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const existing = await db.streaks.get("current");

  if (!existing) {
    await db.streaks.put({ id: "current", currentStreak: 1, longestStreak: 1, lastPracticeDate: today });
    return;
  }

  if (existing.lastPracticeDate === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const currentStreak = existing.lastPracticeDate === yesterday ? existing.currentStreak + 1 : 1;
  const longestStreak = Math.max(existing.longestStreak, currentStreak);

  await db.streaks.put({ id: "current", currentStreak, longestStreak, lastPracticeDate: today });
}
