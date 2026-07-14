import { db } from "@/services/db";
import { nanoid } from "@/lib/id";
import type { CustomQuestion, Question } from "@/types";

export async function addCustomQuestion(
  question: Omit<Question, "id">,
  createdBy: string
): Promise<CustomQuestion> {
  const record: CustomQuestion = {
    ...question,
    id: `custom_${nanoid()}`,
    createdBy,
    createdAt: Date.now(),
  };
  await db.customQuestions.put(record);
  return record;
}

export async function getCustomQuestions(): Promise<CustomQuestion[]> {
  return db.customQuestions.orderBy("createdAt").reverse().toArray();
}

export async function deleteCustomQuestion(id: string): Promise<void> {
  await db.customQuestions.delete(id);
}
