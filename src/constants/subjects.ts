import type { Subject } from "@/types";

export interface SubjectConfig {
  key: Subject;
  label: string;
  color: string;
  icon: "atom" | "flask-conical" | "leaf" | "paw-print";
}

export const SUBJECTS: SubjectConfig[] = [
  { key: "Physics", label: "Physics", color: "#2563EB", icon: "atom" },
  { key: "Chemistry", label: "Chemistry", color: "#10B981", icon: "flask-conical" },
  { key: "Botany", label: "Botany", color: "#22C55E", icon: "leaf" },
  { key: "Zoology", label: "Zoology", color: "#F97316", icon: "paw-print" },
];

export const SUBJECT_SLUGS: Record<string, Subject> = {
  physics: "Physics",
  chemistry: "Chemistry",
  botany: "Botany",
  zoology: "Zoology",
};

export function subjectToSlug(subject: Subject): string {
  return subject.toLowerCase();
}

export function slugToSubject(slug: string): Subject | undefined {
  return SUBJECT_SLUGS[slug.toLowerCase()];
}

/**
 * NEET groups Botany + Zoology under one "Biology" subject in the exam and in
 * how students think about the syllabus, even though the data model keeps
 * them separate (different question banks, chapters, etc). This is a
 * presentation-only grouping used for the Subjects landing page/dashboard.
 */
export interface SubjectSectionConfig {
  key: "physics" | "chemistry" | "biology";
  label: string;
  color: string;
  icon: "atom" | "flask-conical" | "leaf";
  subjects: Subject[];
  href: string;
}

export const SUBJECT_SECTIONS: SubjectSectionConfig[] = [
  { key: "physics", label: "Physics", color: "#2563EB", icon: "atom", subjects: ["Physics"], href: "/subjects/physics" },
  {
    key: "chemistry",
    label: "Chemistry",
    color: "#10B981",
    icon: "flask-conical",
    subjects: ["Chemistry"],
    href: "/subjects/chemistry",
  },
  {
    key: "biology",
    label: "Biology",
    color: "#22C55E",
    icon: "leaf",
    subjects: ["Botany", "Zoology"],
    href: "/subjects/biology",
  },
];
