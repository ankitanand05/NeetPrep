import Link from "next/link";
import { Atom, FlaskConical, Leaf, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SubjectSectionConfig } from "@/constants/subjects";
import type { SchoolClass } from "@/types";

const ICONS = { atom: Atom, "flask-conical": FlaskConical, leaf: Leaf };

export function SectionCard({
  section,
  classCounts,
}: {
  section: SubjectSectionConfig;
  classCounts: Record<SchoolClass, number>;
}) {
  const Icon = ICONS[section.icon];
  const total = classCounts["11"] + classCounts["12"];

  return (
    <Link href={section.href}>
      <Card className="group border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${section.color}1A`, color: section.color }}
          >
            <Icon className="size-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">{section.label}</p>
            <p className="text-sm text-muted-foreground">{total} chapters</p>
            <div className="mt-2 flex gap-1.5">
              <Badge variant="outline" className="text-[10px]">
                Class 11 · {classCounts["11"]}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                Class 12 · {classCounts["12"]}
              </Badge>
            </div>
          </div>
          <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </CardContent>
      </Card>
    </Link>
  );
}
