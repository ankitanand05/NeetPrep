import { db } from "@/services/db";

export async function getBookmarkedIdSet(ids: string[]): Promise<Set<string>> {
  const idSet = new Set(ids);
  const rows = await db.bookmarks.toArray();
  return new Set(rows.filter((r) => idSet.has(r.questionId)).map((r) => r.questionId));
}
