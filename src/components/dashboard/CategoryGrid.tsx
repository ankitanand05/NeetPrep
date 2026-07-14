import Link from "next/link";
import { ChevronRight, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { subjectToSlug } from "@/constants/subjects";
import { unitToSlug } from "@/features/questions";
import type { SchoolClass, Subject } from "@/types";

export interface CategoryInfo {
  subject: Subject;
  unit: string;
  chapterCount: number;
}

export function CategoryGrid({ categories, schoolClass }: { categories: CategoryInfo[]; schoolClass: SchoolClass }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {categories.map((cat) => (
        <Link
          key={`${cat.subject}-${cat.unit}`}
          href={`/subjects/${subjectToSlug(cat.subject)}/category/${unitToSlug(cat.unit)}?class=${schoolClass}`}
        >
          <Card className="group border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Layers className="size-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{cat.unit}</p>
                <p className="text-sm text-muted-foreground">
                  {cat.chapterCount} chapter{cat.chapterCount === 1 ? "" : "s"}
                </p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
