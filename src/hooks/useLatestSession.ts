"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";

export function useLatestUnfinishedSession() {
  return useLiveQuery(
    async () => {
      const sessions = await db.practiceSessions
        .where("status")
        .anyOf(["in_progress", "paused"])
        .toArray();
      sessions.sort((a, b) => (b.startedAt ?? 0) - (a.startedAt ?? 0));
      return sessions[0] ?? null;
    },
    [],
    null
  );
}
