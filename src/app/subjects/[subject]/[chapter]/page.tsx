import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ChapterStats } from "@/components/dashboard/ChapterStats";
import { ChapterActions } from "@/components/dashboard/ChapterActions";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { slugToSubject, subjectToSlug } from "@/constants/subjects";
import { chapterToSlug, getChaptersForSubject, getQuestionsForChapter, slugToChapter } from "@/features/questions";
import type { Difficulty } from "@/types";

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

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
          <div className="mt-3 flex flex-wrap gap-2">
            {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) =>
              difficultyCounts[d] > 0 ? (
                <Badge key={d} variant="outline" className={DIFFICULTY_COLORS[d]}>
                  {d}: {difficultyCounts[d]}
                </Badge>
              ) : null
            )}
          </div>
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
            <ChapterActions subject={subject} chapter={chapter} />
          </>
        )}
      </div>
    </AppShell>
  );
}
