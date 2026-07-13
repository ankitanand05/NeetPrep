import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ChapterStats } from "@/components/dashboard/ChapterStats";
import { ChapterActions } from "@/components/dashboard/ChapterActions";
import { DifficultySectionCard } from "@/components/dashboard/DifficultySectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Clock } from "lucide-react";
import { slugToSubject, subjectToSlug } from "@/constants/subjects";
import { chapterToSlug, getChaptersForSubject, getQuestionsForChapter, slugToChapter } from "@/features/questions";
import { DIFFICULTY_ORDER } from "@/constants/difficulty";
import type { Difficulty } from "@/types";

export function generateStaticParams() {
  const params: { subject: string; chapter: string }[] = [];
  for (const subject of ["Physics", "Chemistry", "Botany", "Zoology"] as const) {
    for (const chapter of getChaptersForSubject(subject)) {
      params.push({ subject: subjectToSlug(subject), chapter: chapterToSlug(chapter.chapter) });
    }
  }
  return params;
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>;
}) {
  const { subject: subjectSlug, chapter: chapterSlug } = await params;
  const subject = slugToSubject(subjectSlug);
  if (!subject) notFound();

  const chapter = slugToChapter(subject, chapterSlug);
  if (!chapter) notFound();

  const questions = getQuestionsForChapter(subject, chapter);
  const meta = getChaptersForSubject(subject).find((c) => c.chapter === chapter)!;

  const difficultyCounts: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  for (const q of questions) difficultyCounts[q.difficulty] += 1;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {subject} · {meta.unit}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{chapter}</h1>
        </div>

        {questions.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Questions coming soon"
            description="This chapter is on the syllabus but no questions have been added yet. Check back after the next content update."
          />
        ) : (
          <>
            <ChapterStats subject={subject} chapter={chapter} questionCount={questions.length} />

            <div>
              <h2 className="text-lg font-semibold tracking-tight">Practice by difficulty</h2>
              <p className="text-sm text-muted-foreground">Pick a level to start a focused, section-wise session.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {DIFFICULTY_ORDER.map((d: Difficulty) => (
                  <DifficultySectionCard
                    key={d}
                    subject={subject}
                    chapter={chapter}
                    difficulty={d}
                    count={difficultyCounts[d]}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight">More ways to practice</h2>
              <div className="mt-4">
                <ChapterActions subject={subject} chapter={chapter} />
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
