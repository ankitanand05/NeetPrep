import { AppShell } from "@/components/layout/AppShell";
import { ClassSubjectSelector } from "@/components/dashboard/ClassSubjectSelector";
import { SUBJECT_SECTIONS } from "@/constants/subjects";
import { getChapterCountsByClass } from "@/features/questions";

export default function SubjectsPage() {
  const sections = SUBJECT_SECTIONS.map((section) => ({
    section,
    countsByClass: getChapterCountsByClass(section.subjects),
  }));

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Subjects</h1>
          <p className="mt-1 text-muted-foreground">Pick your class, then a subject to browse chapters.</p>
        </div>

        <ClassSubjectSelector sections={sections} />
      </div>
    </AppShell>
  );
}
