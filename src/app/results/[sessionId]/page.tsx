"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, RotateCcw, ListChecks, XCircle, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/common/StatCard";
import { ResultPieChart } from "@/components/charts/ResultPieChart";
import { DifficultyBarChart } from "@/components/charts/DifficultyBarChart";
import { TimelineChart } from "@/components/charts/TimelineChart";
import { loadSession, computeSummary, createPracticeSession, saveSession } from "@/features/practice";
import { getQuestionsByIds } from "@/features/questions";
import { formatTime, formatPercent } from "@/lib/format";
import { CheckCircle2, Target, Clock } from "lucide-react";
import type { PracticeSession, Question, SessionSummary } from "@/types";

export default function ResultsPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  useEffect(() => {
    (async () => {
      const loaded = await loadSession(params.sessionId);
      if (!loaded) return;
      const qs = getQuestionsByIds(loaded.questionIds);
      setSession(loaded);
      setQuestions(qs);
      setSummary(computeSummary(loaded, qs));
    })();
  }, [params.sessionId]);

  async function handleRetry() {
    if (!session) return;
    const newSession = createPracticeSession({
      subject: session.subject,
      chapter: session.chapter,
      mode: session.mode,
      questions,
      shuffleQuestions: session.shuffleQuestions,
      shuffleOptions: session.shuffleOptions,
      timeLimitSec: session.timeLimitSec,
    });
    await saveSession(newSession);
    router.push(`/practice/${newSession.id}`);
  }

  async function handlePracticeWrong() {
    if (!session || !summary) return;
    const wrongIds = session.attempts.filter((a) => a.correct === false).map((a) => a.questionId);
    const wrongQuestions = questions.filter((q) => wrongIds.includes(q.id));
    if (wrongQuestions.length === 0) return;
    const newSession = createPracticeSession({
      subject: session.subject,
      chapter: session.chapter,
      mode: "wrong",
      questions: wrongQuestions,
    });
    await saveSession(newSession);
    router.push(`/practice/${newSession.id}`);
  }

  if (!session || !summary) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const fastestQ = summary.fastestQuestionId
    ? questions.find((q) => q.id === summary.fastestQuestionId)
    : null;
  const slowestQ = summary.slowestQuestionId
    ? questions.find((q) => q.id === summary.slowestQuestionId)
    : null;

  return (
    <div className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {session.subject} · {session.chapter}
          </p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight">
            {summary.correct} / {summary.total}
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">{formatPercent((summary.correct / summary.total) * 100)} score</p>
        </div>

        {summary.ungraded > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {summary.ungraded} question{summary.ungraded === 1 ? "" : "s"} answered but not yet scored — the answer
            key hasn&apos;t been added for this chapter.
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={CheckCircle2} label="Correct" value={String(summary.correct)} accent="success" />
          <StatCard icon={XCircle} label="Wrong" value={String(summary.wrong)} accent="destructive" />
          <StatCard icon={ListChecks} label="Skipped" value={String(summary.skipped)} accent="warning" />
          <StatCard icon={Target} label="Accuracy" value={formatPercent(summary.accuracy)} accent="primary" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={Clock} label="Time Taken" value={formatTime(summary.timeTakenSec)} accent="accent" />
          <StatCard icon={Clock} label="Avg Time / Q" value={formatTime(summary.avgTimeSec)} accent="accent" />
          <StatCard
            icon={Clock}
            label="Fastest"
            value={fastestQ ? formatTime(session.attempts.find((a) => a.questionId === fastestQ.id)!.timeTakenSec) : "—"}
            accent="success"
          />
          <StatCard
            icon={Clock}
            label="Slowest"
            value={slowestQ ? formatTime(session.attempts.find((a) => a.questionId === slowestQ.id)!.timeTakenSec) : "—"}
            accent="warning"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Result Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultPieChart
                correct={summary.correct}
                wrong={summary.wrong}
                skipped={summary.skipped}
                ungraded={summary.ungraded}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance by Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <DifficultyBarChart byDifficulty={summary.byDifficulty} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Time per Question</CardTitle>
          </CardHeader>
          <CardContent>
            <TimelineChart attempts={session.attempts} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance by Topic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(summary.byTopic).map(([topic, stat]) => (
              <div key={topic} className="flex items-center justify-between text-sm">
                <span>{topic}</span>
                <span className="text-muted-foreground">
                  {stat.correct}/{stat.total} correct
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={handleRetry}>
            <RotateCcw className="size-4" />
            Retry
          </Button>
          <Button variant="outline" render={<Link href={`/review/${session.id}`} />}>
            Review Answers
          </Button>
          {summary.wrong > 0 && (
            <Button variant="outline" onClick={handlePracticeWrong}>
              <XCircle className="size-4" />
              Practice Wrong Questions
            </Button>
          )}
          <Button variant="ghost" render={<Link href="/dashboard" />}>
            <LayoutDashboard className="size-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
