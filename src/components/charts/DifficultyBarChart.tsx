"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SessionSummary } from "@/types";

export function DifficultyBarChart({ byDifficulty }: { byDifficulty: SessionSummary["byDifficulty"] }) {
  const data = (["Easy", "Medium", "Hard"] as const).map((difficulty) => ({
    difficulty,
    correct: byDifficulty[difficulty].correct,
    incorrect: byDifficulty[difficulty].total - byDifficulty[difficulty].correct,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="difficulty" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip />
        <Legend />
        <Bar dataKey="correct" stackId="a" fill="var(--success)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="incorrect" stackId="a" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
