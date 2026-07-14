import { CHAPTER_FILES } from "@/data/manifest";
import { getSyllabusForSubject } from "@/constants/syllabus";
import type { ChapterMeta, Question, SchoolClass, Subject } from "@/types";

let allQuestionsCache: Question[] | null = null;

export function getAllQuestions(): Question[] {
  if (allQuestionsCache) return allQuestionsCache;
  allQuestionsCache = Object.values(CHAPTER_FILES).flat(2);
  return allQuestionsCache;
}

export function getQuestionsForSubject(subject: Subject): Question[] {
  return (CHAPTER_FILES[subject] ?? []).flat();
}

export function getQuestionsForChapter(subject: Subject, chapter: string): Question[] {
  return getQuestionsForSubject(subject).filter((q) => q.chapter === chapter);
}

export function getQuestionById(id: string): Question | undefined {
  return getAllQuestions().find((q) => q.id === id);
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const all = getAllQuestions();
  const map = new Map(all.map((q) => [q.id, q]));
  return ids.map((id) => map.get(id)).filter((q): q is Question => Boolean(q));
}

export function getChaptersForSubject(subject: Subject): ChapterMeta[] {
  const questions = getQuestionsForSubject(subject);
  const countByChapter = new Map<string, number>();
  for (const q of questions) {
    countByChapter.set(q.chapter, (countByChapter.get(q.chapter) ?? 0) + 1);
  }

  return getSyllabusForSubject(subject).map((c) => ({
    subject: c.subject,
    class: c.class,
    unit: c.unit,
    chapter: c.chapter,
    questionCount: countByChapter.get(c.chapter) ?? 0,
  }));
}

export function getChapterMeta(subject: Subject, chapter: string): ChapterMeta | undefined {
  return getChaptersForSubject(subject).find((c) => c.chapter === chapter);
}

export function getChapterCountsByClass(subjects: Subject[]): Record<SchoolClass, number> {
  const counts: Record<SchoolClass, number> = { "11": 0, "12": 0 };
  for (const subject of subjects) {
    for (const chapter of getChaptersForSubject(subject)) {
      counts[chapter.class] += 1;
    }
  }
  return counts;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function chapterToSlug(chapter: string): string {
  return slugify(chapter);
}

export function slugToChapter(subject: Subject, slug: string): string | undefined {
  return getChaptersForSubject(subject).find((c) => chapterToSlug(c.chapter) === slug)?.chapter;
}

export function unitToSlug(unit: string): string {
  return slugify(unit);
}

/**
 * Unit names can repeat across classes for the same subject (e.g. Chemistry's
 * "Physical Chemistry" exists in both Class 11 and 12), so resolving a unit
 * slug always requires a class to disambiguate.
 */
export function slugToUnit(subject: Subject, schoolClass: SchoolClass, slug: string): string | undefined {
  return getChaptersForSubject(subject).find((c) => c.class === schoolClass && unitToSlug(c.unit) === slug)?.unit;
}
