"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Atom, ChevronRight, FlaskConical, GraduationCap, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SubjectSectionConfig } from "@/constants/subjects";
import type { SchoolClass } from "@/types";

const ICONS = { atom: Atom, "flask-conical": FlaskConical, leaf: Leaf };
const CLASSES: SchoolClass[] = ["11", "12"];

export interface SectionWithClassCounts {
  section: SubjectSectionConfig;
  countsByClass: Record<SchoolClass, number>;
}

export function ClassSubjectSelector({ sections }: { sections: SectionWithClassCounts[] }) {
  const [selectedClass, setSelectedClass] = useState<SchoolClass>("11");

  const totalsByClass: Record<SchoolClass, number> = { "11": 0, "12": 0 };
  for (const { countsByClass } of sections) {
    totalsByClass["11"] += countsByClass["11"];
    totalsByClass["12"] += countsByClass["12"];
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CLASSES.map((cls) => {
          const isSelected = selectedClass === cls;
          return (
            <button key={cls} type="button" onClick={() => setSelectedClass(cls)} className="text-left">
              <Card
                className={cn(
                  "border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md",
                  isSelected && "border-primary ring-1 ring-primary bg-primary/5"
                )}
              >
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-xl",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                    )}
                  >
                    <GraduationCap className="size-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Class {cls}</p>
                    <p className="text-sm text-muted-foreground">
                      {totalsByClass[cls]} chapters across Physics, Chemistry &amp; Biology
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      <motion.div
        key={selectedClass}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Subjects for Class {selectedClass}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ section, countsByClass }) => {
            const Icon = ICONS[section.icon];
            return (
              <Link key={section.key} href={`${section.href}?class=${selectedClass}`}>
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
                      <p className="text-sm text-muted-foreground">
                        {countsByClass[selectedClass]} chapter{countsByClass[selectedClass] === 1 ? "" : "s"}
                      </p>
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
