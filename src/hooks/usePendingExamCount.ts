"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";
import type { Role } from "@/constants/auth";

/**
 * Number of published exams that are currently open (scheduled time has
 * arrived, window hasn't expired) and the student hasn't submitted yet.
 * Only meaningful for the student role.
 */
export function usePendingExamCount(username: string | undefined, role: Role | undefined): number {
  const count = useLiveQuery(
    async () => {
      if (!username || role !== "student") return 0;
      const now = Date.now();
      const papers = await db.examPapers.toArray();
      const attempts = await db.practiceSessions.where("studentUsername").equals(username).toArray();
      const submittedPaperIds = new Set(
        attempts.filter((a) => a.status === "submitted").map((a) => a.examPaperId)
      );

      return papers.filter((p) => {
        const isDue = now >= p.scheduledAt;
        const isExpired = now > p.scheduledAt + p.durationMinutes * 60_000;
        return isDue && !isExpired && !submittedPaperIds.has(p.id);
      }).length;
    },
    [username, role],
    0
  );

  return count ?? 0;
}
