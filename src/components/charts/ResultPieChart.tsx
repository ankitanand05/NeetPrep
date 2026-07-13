"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface ResultPieChartProps {
  correct: number;
  wrong: number;
  skipped: number;
  ungraded?: number;
}

export function ResultPieChart({ correct, wrong, skipped, ungraded = 0 }: ResultPieChartProps) {
  const data = [
    { name: "Correct", value: correct, color: "var(--success)" },
    { name: "Wrong", value: wrong, color: "var(--destructive)" },
    { name: "Skipped", value: skipped, color: "var(--warning)" },
    { name: "Ungraded", value: ungraded, color: "var(--muted-foreground)" },
  ].filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
