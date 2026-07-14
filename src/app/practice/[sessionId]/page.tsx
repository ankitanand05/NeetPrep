"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PracticeTopBar } from "@/components/practice/PracticeTopBar";
import { QuestionCard } from "@/components/practice/QuestionCard";
import { QuestionPalette } from "@/components/practice/QuestionPalette";
import { PracticeControls } from "@/components/practice/PracticeControls";
import { usePracticeSessionStore } from "@/store/practiceSession";
import { loadSession } from "@/features/practice";
import { getBookmarkedIdSet } from "@/features/bookmarks";

export default function PracticeScreenPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [notFound, setNotFound] = useState(false);

  const {
    session,
    questions,
    elapsedSec,
    bookmarkedIds,
    hydrate,
    start,
    selectOption,
    clearResponse,
    toggleMarkForReview,
    toggleBookmarkCurrent,
    goTo,
    next,
    previous,
    submit,
  } = usePracticeSessionStore();

  useEffect(() => {
    let active = true;
    (async () => {
      const loaded = await loadSession(params.sessionId);
      if (!active) return;
      if (!loaded) {
        setNotFound(true);
        return;
      }
      await hydrate(loaded);
      const bookmarks = await getBookmarkedIdSet(loaded.questionIds);
      if (active) usePracticeSessionStore.setState({ bookmarkedIds: bookmarks });
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.sessionId]);

  useEffect(() => {
    if (session?.status === "submitted") {
      router.push(`/results/${params.sessionId}`);
    }
  }, [session?.status, params.sessionId, router]);

  async function handleSubmit() {
    await submit();
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Session not found. It may have been cleared.
      </div>
    );
  }

  if (!session || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (session.status === "not_started") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">
          {session.subject} · {session.chapter}
        </h1>
        <p className="max-w-md text-muted-foreground">
          {questions.length} questions · {session.timeLimitSec !== null ? "Timed" : "Untimed practice"}. The timer
          starts as soon as you click Start.
        </p>
        <Button size="lg" onClick={start}>
          <PlayCircle className="size-5" />
          Start Practice
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[session.currentIndex];
  const currentAttempt = session.attempts[session.currentIndex];
  const isMarked = currentAttempt.status === "marked";
  const isBookmarked = bookmarkedIds.has(currentQuestion.id);

  return (
    <div className="min-h-screen pb-24">
      <PracticeTopBar
        currentIndex={session.currentIndex}
        total={questions.length}
        elapsedSec={elapsedSec}
        timeLimitSec={session.timeLimitSec}
      />

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 md:grid-cols-[1fr_240px] md:px-8">
        <div className="space-y-8">
          <QuestionCard
            question={currentQuestion}
            optionOrder={session.optionOrders[session.currentIndex]}
            selectedOption={currentAttempt.selectedOption}
            isBookmarked={isBookmarked}
            onSelect={selectOption}
          />
          <PracticeControls
            isFirst={session.currentIndex === 0}
            isLast={session.currentIndex === questions.length - 1}
            isMarked={isMarked}
            isBookmarked={isBookmarked}
            onPrevious={previous}
            onNext={next}
            onClear={clearResponse}
            onToggleMark={toggleMarkForReview}
            onToggleBookmark={toggleBookmarkCurrent}
            onSubmit={handleSubmit}
          />
        </div>

        <div className="order-first md:order-last">
          <QuestionPalette attempts={session.attempts} currentIndex={session.currentIndex} onNavigate={goTo} />
        </div>
      </div>
    </div>
  );
}
