import Link from "next/link";
import { Atom, FlaskConical, Leaf, PawPrint, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SubjectConfig } from "@/constants/subjects";
import { subjectToSlug } from "@/constants/subjects";

const ICONS = { atom: Atom, "flask-conical": FlaskConical, leaf: Leaf, "paw-print": PawPrint };

export function SubjectCard({ subject, chapterCount }: { subject: SubjectConfig; chapterCount: number }) {
  const Icon = ICONS[subject.icon];
  return (
    <Link href={`/subjects/${subjectToSlug(subject.key)}`}>
      <Card className="group border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${subject.color}1A`, color: subject.color }}
          >
            <Icon className="size-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">{subject.label}</p>
            <p className="text-sm text-muted-foreground">{chapterCount} chapters</p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </CardContent>
      </Card>
    </Link>
  );
}
