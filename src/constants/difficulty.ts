import type { Difficulty } from "@/types";

export const DIFFICULTY_ORDER: Difficulty[] = ["Easy", "Medium", "Hard"];

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

export const DIFFICULTY_ICON_CLASSES: Record<Difficulty, string> = {
  Easy: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  Hard: "bg-destructive/10 text-destructive",
};

export const DIFFICULTY_RING_CLASSES: Record<Difficulty, string> = {
  Easy: "hover:border-success/40",
  Medium: "hover:border-warning/40",
  Hard: "hover:border-destructive/40",
};

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  Easy: "Warm up with the fundamentals",
  Medium: "Build exam-level speed & accuracy",
  Hard: "Challenge yourself with tricky questions",
};
