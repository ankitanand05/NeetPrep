import { db } from "@/services/db";
import { nanoid } from "@/lib/id";
import type { ExamPaper, PracticeSession, Subject } from "@/types";

export interface PublishExamPaperOptions {
  title: string;
  questionIds: string[];
  subjects: Subject[];
  durationMinutes: number;
  scheduledAt: number;
  createdBy: string;
}

export async function publishExamPaper(opts: PublishExamPaperOptions): Promise<ExamPaper> {
  const paper: ExamPaper = {
    id: `exam_${nanoid()}`,
    title: opts.title,
    subjects: opts.subjects,
    questionIds: opts.questionIds,
    durationMinutes: opts.durationMinutes,
    scheduledAt: opts.scheduledAt,
    createdBy: opts.createdBy,
    createdAt: Date.now(),
  };

  await db.examPapers.put(paper);
  return paper;
}

export async function getExamPapers(): Promise<ExamPaper[]> {
  return db.examPapers.orderBy("createdAt").reverse().toArray();
}

export async function getExamPaper(id: string): Promise<ExamPaper | undefined> {
  return db.examPapers.get(id);
}

export async function deleteExamPaper(id: string): Promise<void> {
  await db.examPapers.delete(id);
}

export interface UpdateExamPaperOptions {
  title: string;
  questionIds: string[];
  subjects: Subject[];
  durationMinutes: number;
  scheduledAt: number;
}

export async function updateExamPaper(id: string, updates: UpdateExamPaperOptions): Promise<void> {
  const existing = await db.examPapers.get(id);
  if (!existing) throw new Error("Exam paper not found.");
  await db.examPapers.put({ ...existing, ...updates });
}

export async function getExamAttempts(examPaperId: string): Promise<PracticeSession[]> {
  return db.practiceSessions.where("examPaperId").equals(examPaperId).toArray();
}

export async function publishResult(sessionId: string): Promise<void> {
  await db.practiceSessions.update(sessionId, { resultPublished: true });
}

export async function unpublishResult(sessionId: string): Promise<void> {
  await db.practiceSessions.update(sessionId, { resultPublished: false });
}
