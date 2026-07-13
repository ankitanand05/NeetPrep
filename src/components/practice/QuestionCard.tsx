"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Bookmark, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Question } from "@/types";

const DIFFICULTY_COLORS: Record<Question["difficulty"], string> = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

const OPTION_LABELS = ["A", "B", "C", "D"];

interface QuestionCardProps {
  question: Question;
  optionOrder: number[];
  selectedOption: number | null;
  isBookmarked: boolean;
  onSelect: (optionIndex: number) => void;
}

export function QuestionCard({ question, optionOrder, selectedOption, isBookmarked, onSelect }: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={DIFFICULTY_COLORS[question.difficulty]}>
            {question.difficulty}
          </Badge>
          <Badge variant="secondary">{question.topic}</Badge>
          {question.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        {isBookmarked && <Bookmark className="size-5 shrink-0 fill-primary text-primary" />}
      </div>

      <p className="text-lg leading-relaxed font-medium">{question.question}</p>

      {question.image && (
        <div className="overflow-hidden rounded-xl border border-border">
          <Image src={question.image} alt="Question illustration" width={640} height={360} className="w-full" />
        </div>
      )}

      <div className="grid gap-3">
        {optionOrder.map((optionIndex, position) => {
          const isSelected = selectedOption === optionIndex;
          return (
            <button
              key={optionIndex}
              type="button"
              onClick={() => onSelect(optionIndex)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                isSelected
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border hover:border-primary/40 hover:bg-accent/5"
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                )}
              >
                {isSelected ? <CheckCircle2 className="size-4" /> : OPTION_LABELS[position]}
              </span>
              <span>{question.options[optionIndex]}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
