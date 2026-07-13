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
