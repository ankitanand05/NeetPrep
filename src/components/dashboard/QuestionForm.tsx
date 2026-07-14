"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getChaptersForSubject } from "@/features/questions";
import { SUBJECTS } from "@/constants/subjects";
import type { Difficulty, Question, QuestionTag, Subject } from "@/types";

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const TAG_OPTIONS: QuestionTag[] = ["NCERT", "PYQ", "Important"];
const EMPTY_OPTIONS: [string, string, string, string] = ["", "", "", ""];

export interface QuestionFormProps {
  defaultSubject?: Subject;
  onSubmit: (question: Omit<Question, "id">) => Promise<void>;
  submitLabel?: string;
}

export function QuestionForm({ defaultSubject, onSubmit, submitLabel = "Add Question" }: QuestionFormProps) {
  const [subject, setSubject] = useState<Subject | "">(defaultSubject ?? "");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<[string, string, string, string]>(EMPTY_OPTIONS);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [solution, setSolution] = useState("");
  const [tags, setTags] = useState<QuestionTag[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const chapters = useMemo(() => (subject ? getChaptersForSubject(subject) : []), [subject]);
  const chapterMeta = chapters.find((c) => c.chapter === chapter);

  function toggleTag(tag: QuestionTag) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function resetForm() {
    setTopic("");
    setDifficulty("Medium");
    setQuestionText("");
    setOptions(EMPTY_OPTIONS);
    setCorrectAnswer(0);
    setSolution("");
    setTags([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!subject || !chapterMeta) {
      toast.error("Pick a subject and chapter.");
      return;
    }
    if (!questionText.trim() || options.some((o) => !o.trim()) || !solution.trim()) {
      toast.error("Fill in the question, all 4 options, and the solution.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        subject,
        class: chapterMeta.class,
        unit: chapterMeta.unit,
        chapter: chapterMeta.chapter,
        topic: topic.trim() || chapterMeta.chapter,
        difficulty,
        question: questionText.trim(),
        options: options.map((o) => o.trim()),
        correctAnswer,
        solution: solution.trim(),
        tags,
      });
      resetForm();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Subject</Label>
          <Select
            value={subject}
            onValueChange={(v) => {
              setSubject(v as Subject);
              setChapter("");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Chapter</Label>
          <Select value={chapter} onValueChange={(v) => setChapter(v ?? "")} disabled={!subject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select chapter" />
            </SelectTrigger>
            <SelectContent>
              {chapters.map((c) => (
                <SelectItem key={c.chapter} value={c.chapter}>
                  {c.chapter} (Class {c.class})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Newton's Laws"
          />
        </div>
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="question-text">Question</Label>
        <Textarea
          id="question-text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={3}
          placeholder="Type the question…"
        />
      </div>

      <div className="space-y-2">
        <Label>Options (select the radio for the correct answer)</Label>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="radio"
                name="correct-option"
                checked={correctAnswer === i}
                onChange={() => setCorrectAnswer(i)}
                className="size-4 accent-primary"
                aria-label={`Mark option ${i + 1} as correct`}
              />
              <Input
                value={opt}
                onChange={(e) =>
                  setOptions((prev) => {
                    const next = [...prev] as typeof prev;
                    next[i] = e.target.value;
                    return next;
                  })
                }
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="solution">Explanation / Solution</Label>
        <Textarea
          id="solution"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          rows={3}
          placeholder="Explain the correct answer…"
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                tags.includes(tag)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={submitting}>
        <Plus className="size-4" />
        {submitting ? "Adding…" : submitLabel}
      </Button>
    </form>
  );
}
