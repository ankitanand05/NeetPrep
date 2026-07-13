import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ChapterListItem } from "@/components/dashboard/ChapterListItem";
import { EmptyState } from "@/components/common/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { slugToSubject, SUBJECTS } from "@/constants/subjects";
import { getChaptersForSubject } from "@/features/questions";
import { BookOpen } from "lucide-react";
import type { ChapterMeta, SchoolClass } from "@/types";

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subject: s.key.toLowerCase() }));
}

function groupByUnit(chapters: ChapterMeta[]): Map<string, ChapterMeta[]> {
  const groups = new Map<string, ChapterMeta[]>();
  for (const chapter of chapters) {
    const list = groups.get(chapter.unit) ?? [];
    list.push(chapter);
    groups.set(chapter.unit, list);
  }
  return groups;
}

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectSlug } = await params;
  const subject = slugToSubject(subjectSlug);
  if (!subject) notFound();

  const chapters = getChaptersForSubject(subject);
  const availableCount = chapters.filter((c) => c.questionCount > 0).length;
  const classes: SchoolClass[] = ["11", "12"];

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{subject}</h1>
          <p className="mt-1 text-muted-foreground">
            {chapters.length} chapters in the syllabus · {availableCount} ready for practice.
          </p>
        </div>

        {chapters.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No chapters yet"
            description="Chapters for this subject will appear here as soon as question JSON files are added."
          />
        ) : (
          <Tabs defaultValue="11">
            <TabsList>
              {classes.map((c) => (
                <TabsTrigger key={c} value={c}>
                  Class {c}
                </TabsTrigger>
              ))}
            </TabsList>
            {classes.map((c) => {
              const classChapters = chapters.filter((ch) => ch.class === c);
              const grouped = groupByUnit(classChapters);
              return (
                <TabsContent key={c} value={c} className="space-y-6 pt-4">
                  {Array.from(grouped.entries()).map(([unit, unitChapters]) => (
                    <div key={unit} className="space-y-3">
                      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{unit}</h2>
                      <div className="grid gap-3">
                        {unitChapters.map((chapter) => (
                          <ChapterListItem key={chapter.chapter} chapter={chapter} />
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </AppShell>
  );
}
