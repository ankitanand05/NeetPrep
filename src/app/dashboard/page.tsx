import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { ContinuePracticeCard } from "@/components/dashboard/ContinuePracticeCard";
import { OverallStats } from "@/components/dashboard/OverallStats";
import { SUBJECT_SECTIONS } from "@/constants/subjects";
import { getChapterCountsByClass } from "@/features/questions";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Welcome back</h1>
          <p className="mt-1 text-muted-foreground">Here&apos;s how your NEET prep is going.</p>
        </div>

        <ContinuePracticeCard />

        <OverallStats />

        <div>
          <h2 className="mb-4 text-lg font-semibold">Subjects</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECT_SECTIONS.map((section) => (
              <SectionCard
                key={section.key}
                section={section}
                classCounts={getChapterCountsByClass(section.subjects)}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
