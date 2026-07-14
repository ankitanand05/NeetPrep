export type Subject = "Physics" | "Chemistry" | "Botany" | "Zoology";
export type SchoolClass = "11" | "12";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type QuestionTag = "NCERT" | "PYQ" | "Important";

export interface Question {
  id: string;
  subject: Subject;
  class: SchoolClass;
  unit: string;
  chapter: string;
  topic: string;
  difficulty: Difficulty;
  question: string;
  image?: string;
  options: string[];
  /** null when the answer key hasn't been supplied yet — question is practiceable but ungraded. */
  correctAnswer: number | null;
  solution: string;
  solutionImage?: string;
  tags: QuestionTag[];
}

export interface CustomQuestion extends Question {
  createdBy: string;
  createdAt: number;
}

export interface ChapterMeta {
  subject: Subject;
  class: SchoolClass;
  unit: string;
  chapter: string;
  questionCount: number;
}
