import { nanoid } from "@/lib/id";
import { shuffleArray, shuffledIndexOrder } from "@/lib/shuffle";
import type { PracticeMode, PracticeSession, Question, Subject } from "@/types";

export interface CreateSessionOptions {
  subject: Subject | "Mixed";
  chapter: string;
  mode: PracticeMode;
  questions: Question[];
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  timeLimitSec?: number | null;
}

export function createPracticeSession(opts: CreateSessionOptions): PracticeSession {
  const {
    subject,
    chapter,
    mode,
    questions,
    shuffleQuestions = false,
    shuffleOptions = false,
    timeLimitSec = null,
  } = opts;

  const orderedQuestions = shuffleQuestions ? shuffleArray(questions) : questions;
  const questionIds = orderedQuestions.map((q) => q.id);
  const optionOrders = orderedQuestions.map((q) =>
    shuffleOptions ? shuffledIndexOrder(q.options.length) : q.options.map((_, i) => i)
  );

  return {
    id: nanoid(),
    subject,
    chapter,
    mode,
    questionIds,
    optionOrders,
    shuffleQuestions,
    shuffleOptions,
    timeLimitSec,
    startedAt: null,
    submittedAt: null,
    status: "not_started",
    currentIndex: 0,
    attempts: questionIds.map((questionId) => ({
      questionId,
      selectedOption: null,
      status: "unanswered",
      timeTakenSec: 0,
      correct: null,
    })),
  };
}
