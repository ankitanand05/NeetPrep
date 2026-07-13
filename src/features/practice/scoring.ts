import type { Difficulty, PracticeSession, Question, SessionSummary } from "@/types";

export function computeSummary(session: PracticeSession, questions: Question[]): SessionSummary {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const byDifficulty: SessionSummary["byDifficulty"] = {
    Easy: { total: 0, correct: 0 },
    Medium: { total: 0, correct: 0 },
    Hard: { total: 0, correct: 0 },
  };
  const byTopic: SessionSummary["byTopic"] = {};

  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  let ungraded = 0;
  let totalTime = 0;
  let fastest: { id: string; time: number } | null = null;
  let slowest: { id: string; time: number } | null = null;

  for (const attempt of session.attempts) {
    const question = questionMap.get(attempt.questionId);
    if (!question) continue;

    totalTime += attempt.timeTakenSec;

    const difficulty: Difficulty = question.difficulty;
    const isGraded = question.correctAnswer !== null;
    if (isGraded) {
      byDifficulty[difficulty].total += 1;
      if (!byTopic[question.topic]) byTopic[question.topic] = { total: 0, correct: 0 };
      byTopic[question.topic].total += 1;
    }

    if (attempt.status === "answered" && attempt.selectedOption !== null) {
      if (!isGraded) {
        ungraded += 1;
      } else if (attempt.correct) {
        correct += 1;
        byDifficulty[difficulty].correct += 1;
        byTopic[question.topic].correct += 1;
      } else {
        wrong += 1;
      }
      if (attempt.timeTakenSec > 0) {
        if (!fastest || attempt.timeTakenSec < fastest.time) {
          fastest = { id: attempt.questionId, time: attempt.timeTakenSec };
        }
        if (!slowest || attempt.timeTakenSec > slowest.time) {
          slowest = { id: attempt.questionId, time: attempt.timeTakenSec };
        }
      }
    } else {
      skipped += 1;
    }
  }

  const total = session.attempts.length;
  const attempted = correct + wrong;

  return {
    sessionId: session.id,
    total,
    correct,
    wrong,
    skipped,
    ungraded,
    accuracy: attempted > 0 ? (correct / attempted) * 100 : 0,
    timeTakenSec: totalTime,
    avgTimeSec: total > 0 ? totalTime / total : 0,
    fastestQuestionId: fastest?.id ?? null,
    slowestQuestionId: slowest?.id ?? null,
    byDifficulty,
    byTopic,
  };
}
