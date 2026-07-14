import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { CategoryGrid } from "@/components/dashboard/CategoryGrid";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getChaptersForSubject } from "@/features/questions";
import { groupChaptersByUnit } from "@/lib/chapters";
import { ArrowLeft } from "lucide-react";
import type { ChapterMeta, SchoolClass, Subject } from "@/types";

const BIOLOGY_SUBJECTS: Subject[] = ["Botany", "Zoology"];

function BiologyCategoriesForClass({
  chaptersBySubject,
  targetClass,
}: {
  chaptersBySubject: Record<Subject, ChapterMeta[]>;
  targetClass: SchoolClass;
}) {
  return (
    <div className="space-y-8">
      {BIOLOGY_SUBJECTS.map((subject) => {
        const classChapters = chaptersBySubject[subject].filter((ch) => ch.class === targetClass);
        if (classChapters.length === 0) return null;
        const grouped = groupChaptersByUnit(classChapters);
        const categories = Array.from(grouped.entries()).map(([unit, unitChapters]) => ({
          subject,
          unit,
          chapterCount: unitChapters.length,
        }));

        return (
          <div key={subject} className="space-y-4">
            <h2 className="border-b border-border/60 pb-2 text-base font-semibold">{subject}</h2>
            <CategoryGrid categories={categories} schoolClass={targetClass} />
          </div>
        );
      })}
    </div>
  );
}

export default async function BiologySubjectPage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string }>;
}) {
  const { class: classParam } = await searchParams;
  const lockedClass: SchoolClass | null = classParam === "11" || classParam === "12" ? classParam : null;

  const chaptersBySubject = Object.fromEntries(
    BIOLOGY_SUBJECTS.map((s) => [s, getChaptersForSubject(s)])
  ) as Record<Subject, ChapterMeta[]>;

  const allChapters = BIOLOGY_SUBJECTS.flatMap((s) => chaptersBySubject[s]);
  const availableCount = allChapters.filter((c) => c.questionCount > 0).length;
  const classes: SchoolClass[] = ["11", "12"];

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          {lockedClass && (
            <Link
              href="/subjects"
              className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Change class
            </Link>
          )}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Biology</h1>
            {lockedClass && <Badge variant="outline">Class {lockedClass}</Badge>}
          </div>
          <p className="mt-1 text-muted-foreground">
            {allChapters.length} chapters in the syllabus (Botany + Zoology) · {availableCount} ready for practice.
          </p>
        </div>

        {lockedClass ? (
          <BiologyCategoriesForClass chaptersBySubject={chaptersBySubject} targetClass={lockedClass} />
        ) : (
          <Tabs defaultValue="11">
            <TabsList>
              {classes.map((c) => (
                <TabsTrigger key={c} value={c}>
                  Class {c}
                </TabsTrigger>
              ))}
            </TabsList>
            {classes.map((c) => (
              <TabsContent key={c} value={c} className="pt-4">
                <BiologyCategoriesForClass chaptersBySubject={chaptersBySubject} targetClass={c} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </AppShell>
  );
}
