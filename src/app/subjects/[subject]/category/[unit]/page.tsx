import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ChapterListItem } from "@/components/dashboard/ChapterListItem";
import { Badge } from "@/components/ui/badge";
import { slugToSubject, subjectToSlug } from "@/constants/subjects";
import { getChaptersForSubject, slugToUnit } from "@/features/questions";
import { ArrowLeft } from "lucide-react";
import type { SchoolClass } from "@/types";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string; unit: string }>;
  searchParams: Promise<{ class?: string }>;
}) {
  const { subject: subjectSlug, unit: unitSlug } = await params;
  const subject = slugToSubject(subjectSlug);
  if (!subject) notFound();

  const { class: classParam } = await searchParams;
  const schoolClass: SchoolClass = classParam === "12" ? "12" : "11";

  const unit = slugToUnit(subject, schoolClass, unitSlug);
  if (!unit) notFound();

  const chapters = getChaptersForSubject(subject).filter((c) => c.class === schoolClass && c.unit === unit);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <Link
            href={`/subjects/${subjectToSlug(subject)}?class=${schoolClass}`}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to {subject}
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{unit}</h1>
            <Badge variant="outline">Class {schoolClass}</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            {subject} · {chapters.length} chapter{chapters.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="grid gap-3">
          {chapters.map((chapter) => (
            <ChapterListItem key={chapter.chapter} chapter={chapter} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
