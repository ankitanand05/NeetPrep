import { getCustomQuestions } from "./customQuestions";
import { getAllQuestions, getQuestionsForChapter, getQuestionsForSubject } from "./loader";
import type { Question, Subject } from "@/types";

/**
 * Client-only: combines build-time static questions with teacher/admin-added
 * custom questions (stored in IndexedDB) for a given chapter. Use this when
 * actually building a practice/exam session; the static, synchronous loader
 * functions stay untouched for server-rendered chapter pages.
 */
export async function getMergedQuestionsForChapter(subject: Subject, chapter: string): Promise<Question[]> {
  const staticQuestions = getQuestionsForChapter(subject, chapter);
  const custom = await getCustomQuestions();
  const customForChapter = custom.filter((q) => q.subject === subject && q.chapter === chapter);
  return [...staticQuestions, ...customForChapter];
}

export async function getMergedQuestionsForSubjects(subjects: Subject[]): Promise<Question[]> {
  const custom = await getCustomQuestions();
  const staticQuestions = subjects.flatMap((s) => getQuestionsForSubject(s));
  const customQuestions = custom.filter((q) => subjects.includes(q.subject));
  return [...staticQuestions, ...customQuestions];
}

export async function getMergedQuestionsByIds(ids: string[]): Promise<Question[]> {
  const custom = await getCustomQuestions();
  const all = [...getAllQuestions(), ...custom];
  const map = new Map(all.map((q) => [q.id, q]));
  return ids.map((id) => map.get(id)).filter((q): q is Question => Boolean(q));
}
