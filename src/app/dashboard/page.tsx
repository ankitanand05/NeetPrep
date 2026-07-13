import { AppShell } from "@/components/layout/AppShell";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { ContinuePracticeCard } from "@/components/dashboard/ContinuePracticeCard";
import { OverallStats } from "@/components/dashboard/OverallStats";
import { SUBJECTS } from "@/constants/subjects";
import { getChaptersForSubject } from "@/features/questions";

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SUBJECTS.map((subject) => (
              <SubjectCard
                key={subject.key}
                subject={subject}
                chapterCount={getChaptersForSubject(subject.key).length}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
