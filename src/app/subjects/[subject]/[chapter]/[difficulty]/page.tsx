import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PracticeSetCard } from "@/components/dashboard/PracticeSetCard";
import { Badge } from "@/components/ui/badge";
import { slugToSubject } from "@/constants/subjects";
import { getQuestionsForChapter, slugToChapter } from "@/features/questions";
import { DIFFICULTY_COLORS, slugToDifficulty } from "@/constants/difficulty";
import { PRACTICE_SET_SIZE } from "@/constants/practice";
import { ArrowLeft } from "lucide-react";

export default async function DifficultySetsPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string; difficulty: string }>;
}) {
  const { subject: subjectSlug, chapter: chapterSlug, difficulty: difficultySlug } = await params;
  const subject = slugToSubject(subjectSlug);
  if (!subject) notFound();

  const chapter = slugToChapter(subject, chapterSlug);
  if (!chapter) notFound();

  const difficulty = slugToDifficulty(difficultySlug);
  if (!difficulty) notFound();

  const questions = getQuestionsForChapter(subject, chapter).filter((q) => q.difficulty === difficulty);
  if (questions.length === 0) notFound();

  const numSets = Math.ceil(questions.length / PRACTICE_SET_SIZE);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <Link
            href={`/subjects/${subjectSlug}/${chapterSlug}`}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to {chapter}
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{difficulty} Practice Sets</h1>
            <Badge variant="outline" className={DIFFICULTY_COLORS[difficulty]}>
              {difficulty}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            {chapter} · {questions.length} question{questions.length === 1 ? "" : "s"} split into {numSets} set
            {numSets === 1 ? "" : "s"} of up to {PRACTICE_SET_SIZE} each.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: numSets }, (_, i) => {
            const setStart = i * PRACTICE_SET_SIZE;
            const setCount = Math.min(PRACTICE_SET_SIZE, questions.length - setStart);
            return (
              <PracticeSetCard
                key={i}
                subject={subject}
                chapter={chapter}
                difficulty={difficulty}
                setIndex={i}
                setCount={setCount}
              />
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
