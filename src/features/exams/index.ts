import { db } from "@/services/db";
import { nanoid } from "@/lib/id";
import type { ExamPaper, Subject } from "@/types";

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
