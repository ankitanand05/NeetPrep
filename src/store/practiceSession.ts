import { create } from "zustand";
import { getMergedQuestionsByIds } from "@/features/questions";
import { recordSubmission, saveSession, toggleBookmark } from "@/features/practice";
import type { PracticeSession, Question } from "@/types";

interface PracticeSessionState {
  session: PracticeSession | null;
  questions: Question[];
  bookmarkedIds: Set<string>;
  elapsedSec: number;
  questionStartedAt: number | null;
  timerHandle: ReturnType<typeof setInterval> | null;

  hydrate: (session: PracticeSession) => Promise<void>;
  start: () => void;
  pause: () => void;
  resume: () => void;
  selectOption: (optionIndex: number) => void;
  clearResponse: () => void;
  toggleMarkForReview: () => void;
  toggleBookmarkCurrent: () => Promise<void>;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  submit: () => Promise<void>;
  tick: () => void;
}

export const usePracticeSessionStore = create<PracticeSessionState>((set, get) => ({
  session: null,
  questions: [],
  bookmarkedIds: new Set(),
  elapsedSec: 0,
  questionStartedAt: null,
  timerHandle: null,

  hydrate: async (session) => {
    const questions = await getMergedQuestionsByIds(session.questionIds);
    set({ session, questions, elapsedSec: 0, questionStartedAt: null });
  },

  start: () => {
    const { session, timerHandle } = get();
    if (!session || session.status === "in_progress") return;
    if (timerHandle) clearInterval(timerHandle);

    const handle = setInterval(() => get().tick(), 1000);
    set({
      session: { ...session, status: "in_progress", startedAt: Date.now() },
      questionStartedAt: Date.now(),
      timerHandle: handle,
    });
  },

  pause: () => {
    const { session, timerHandle } = get();
    if (!session) return;
    if (timerHandle) clearInterval(timerHandle);
    set({ session: { ...session, status: "paused" }, timerHandle: null });
  },

  resume: () => {
    const { session, timerHandle } = get();
    if (!session) return;
    if (timerHandle) clearInterval(timerHandle);
    const handle = setInterval(() => get().tick(), 1000);
    set({
      session: { ...session, status: "in_progress" },
      questionStartedAt: Date.now(),
      timerHandle: handle,
    });
  },

  tick: () => {
    const { session, elapsedSec } = get();
    if (!session || session.status !== "in_progress") return;
    const nextElapsed = elapsedSec + 1;
    if (session.timeLimitSec !== null && nextElapsed >= session.timeLimitSec) {
      set({ elapsedSec: session.timeLimitSec });
      void get().submit();
      return;
    }
    set({ elapsedSec: nextElapsed });
  },

  selectOption: (optionIndex) => {
    const { session, questions, questionStartedAt } = get();
    if (!session) return;
    const question = questions[session.currentIndex];
    if (!question) return;

    const timeSpent = questionStartedAt ? Math.round((Date.now() - questionStartedAt) / 1000) : 0;
    const attempts = [...session.attempts];
    const attempt = attempts[session.currentIndex];
    attempts[session.currentIndex] = {
      ...attempt,
      selectedOption: optionIndex,
      status: attempt.status === "marked" ? "marked" : "answered",
      timeTakenSec: attempt.timeTakenSec + timeSpent,
      correct: question.correctAnswer === null ? null : optionIndex === question.correctAnswer,
    };

    set({ session: { ...session, attempts }, questionStartedAt: Date.now() });
  },

  clearResponse: () => {
    const { session } = get();
    if (!session) return;
    const attempts = [...session.attempts];
    const attempt = attempts[session.currentIndex];
    attempts[session.currentIndex] = {
      ...attempt,
      selectedOption: null,
      status: "unanswered",
      correct: null,
    };
    set({ session: { ...session, attempts } });
  },

  toggleMarkForReview: () => {
    const { session } = get();
    if (!session) return;
    const attempts = [...session.attempts];
    const attempt = attempts[session.currentIndex];
    const isMarked = attempt.status === "marked";
    attempts[session.currentIndex] = {
      ...attempt,
      status: isMarked ? (attempt.selectedOption !== null ? "answered" : "unanswered") : "marked",
    };
    set({ session: { ...session, attempts } });
  },

  toggleBookmarkCurrent: async () => {
    const { session, questions, bookmarkedIds } = get();
    if (!session) return;
    const question = questions[session.currentIndex];
    if (!question) return;
    const nowBookmarked = await toggleBookmark(question.id);
    const next = new Set(bookmarkedIds);
    if (nowBookmarked) next.add(question.id);
    else next.delete(question.id);
    set({ bookmarkedIds: next });
  },

  goTo: (index) => {
    const { session, questions, questionStartedAt } = get();
    if (!session || index < 0 || index >= questions.length) return;

    const attempts = [...session.attempts];
    const currentAttempt = attempts[session.currentIndex];
    if (session.status === "in_progress" && questionStartedAt) {
      const timeSpent = Math.round((Date.now() - questionStartedAt) / 1000);
      attempts[session.currentIndex] = {
        ...currentAttempt,
        timeTakenSec: currentAttempt.timeTakenSec + timeSpent,
        status:
          currentAttempt.status === "unanswered" && index !== session.currentIndex
            ? "skipped"
            : currentAttempt.status,
      };
    }

    set({
      session: { ...session, attempts, currentIndex: index },
      questionStartedAt: Date.now(),
    });
  },

  next: () => {
    const { session, goTo } = get();
    if (!session) return;
    goTo(session.currentIndex + 1);
  },

  previous: () => {
    const { session, goTo } = get();
    if (!session) return;
    goTo(session.currentIndex - 1);
  },

  submit: async () => {
    const { session, questions, timerHandle } = get();
    if (!session) return;
    if (timerHandle) clearInterval(timerHandle);

    const submitted: PracticeSession = {
      ...session,
      status: "submitted",
      submittedAt: Date.now(),
    };

    set({ session: submitted, timerHandle: null });
    await saveSession(submitted);
    await recordSubmission(submitted, questions);
  },
}));
