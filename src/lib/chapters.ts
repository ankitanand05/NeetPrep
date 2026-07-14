import type { ChapterMeta } from "@/types";

export function groupChaptersByUnit(chapters: ChapterMeta[]): Map<string, ChapterMeta[]> {
  const groups = new Map<string, ChapterMeta[]>();
  for (const chapter of chapters) {
    const list = groups.get(chapter.unit) ?? [];
    list.push(chapter);
    groups.set(chapter.unit, list);
  }
  return groups;
}
