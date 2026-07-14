"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Plus, Save, Search, Send, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuestionForm } from "@/components/dashboard/QuestionForm";
import { useAuthStore } from "@/store/auth";
import {
  addCustomQuestion,
  getChaptersForSubject,
  getMergedQuestionsByIds,
  getMergedQuestionsForSubjects,
} from "@/features/questions";
import { publishExamPaper, updateExamPaper } from "@/features/exams";
import { SUBJECTS } from "@/constants/subjects";
import { DIFFICULTY_COLORS } from "@/constants/difficulty";
import { cn } from "@/lib/utils";
import type { Difficulty, ExamPaper, Question, Subject } from "@/types";

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const OPTION_LABELS = ["A", "B", "C", "D"];

function toDatetimeLocalValue(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export interface ExamBuilderFormProps {
  mode: "create" | "edit";
  existingPaper?: ExamPaper;
}

export function ExamBuilderForm({ mode, existingPaper }: ExamBuilderFormProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [title, setTitle] = useState(existingPaper?.title ?? "");
  const [durationMinutes, setDurationMinutes] = useState(existingPaper?.durationMinutes ?? 60);

  const [subject, setSubject] = useState<Subject>(existingPaper?.subjects[0] ?? "Physics");
  const [chapterFilter, setChapterFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pool, setPool] = useState<Question[]>([]);
  const [loadingPool, setLoadingPool] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [selected, setSelected] = useState<Map<string, Question>>(new Map());
  const [initializingExisting, setInitializingExisting] = useState(mode === "edit");

  const [publishOpen, setPublishOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(
    existingPaper ? toDatetimeLocalValue(existingPaper.scheduledAt) : ""
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !existingPaper) return;
    (async () => {
      const qs = await getMergedQuestionsByIds(existingPaper.questionIds);
      setSelected(new Map(qs.map((q) => [q.id, q])));
      setInitializingExisting(false);
    })();
  }, [mode, existingPaper]);

  useEffect(() => {
    let active = true;
    setLoadingPool(true);
    (async () => {
      const qs = await getMergedQuestionsForSubjects([subject]);
      if (active) {
        setPool(qs);
        setLoadingPool(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [subject]);

  const chapters = useMemo(() => getChaptersForSubject(subject), [subject]);

  const filteredQuestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return pool.filter(
      (question) =>
        (!chapterFilter || question.chapter === chapterFilter) &&
        (difficultyFilter.length === 0 || difficultyFilter.includes(question.difficulty)) &&
        (!q || question.question.toLowerCase().includes(q))
    );
  }, [pool, chapterFilter, difficultyFilter, searchQuery]);

  function toggleDifficultyFilter(d: Difficulty) {
    setDifficultyFilter((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  function toggleSelect(question: Question) {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(question.id)) next.delete(question.id);
      else next.set(question.id, question);
      return next;
    });
  }

  async function handleAddQuestion(question: Omit<Question, "id">) {
    if (!user) return;
    const saved = await addCustomQuestion(question, user.username);
    setPool((prev) => [...prev, saved]);
    setSelected((prev) => new Map(prev).set(saved.id, saved));
    setShowAddForm(false);
    toast.success("Question added and included in this exam.");
  }

  async function handleSave() {
    if (!user) return;
    if (!title.trim()) {
      toast.error("Give the exam a title.");
      return;
    }
    if (selected.size === 0) {
      toast.error("Select at least one question.");
      return;
    }
    if (!scheduledAt) {
      toast.error("Pick the exam date and time.");
      return;
    }

    setSaving(true);
    try {
      const questions = Array.from(selected.values());
      const subjects = Array.from(new Set(questions.map((q) => q.subject)));

      if (mode === "edit" && existingPaper) {
        await updateExamPaper(existingPaper.id, {
          title: title.trim(),
          questionIds: questions.map((q) => q.id),
          subjects,
          durationMinutes,
          scheduledAt: new Date(scheduledAt).getTime(),
        });
        toast.success("Exam updated.");
      } else {
        await publishExamPaper({
          title: title.trim(),
          questionIds: questions.map((q) => q.id),
          subjects,
          durationMinutes,
          scheduledAt: new Date(scheduledAt).getTime(),
          createdBy: user.username,
        });
        toast.success("Exam published.");
      }
      router.push("/manage/exams");
    } finally {
      setSaving(false);
    }
  }

  const isEdit = mode === "edit";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {isEdit ? "Edit Exam" : "Create Exam"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isEdit
              ? "Add or remove questions, then save your changes."
              : "Pick questions from the bank, add new ones, then publish."}
          </p>
        </div>
        <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
          <DialogTrigger render={<Button disabled={selected.size === 0} />}>
            {isEdit ? <Save className="size-4" /> : <Send className="size-4" />}
            {isEdit ? "Save Changes" : "Publish"} ({selected.size})
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Update Schedule & Save" : "Schedule & Publish"}</DialogTitle>
              <DialogDescription>
                This exam becomes visible to students only after {isEdit ? "saving" : "publishing"}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="schedule">Exam date &amp; time</Label>
                <Input
                  id="schedule"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {selected.size} question{selected.size === 1 ? "" : "s"} · {durationMinutes} minutes
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPublishOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Publish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="exam-title">Title</Label>
            <Input
              id="exam-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Physics Mock Test 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={1}
              max={600}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  setSubject(s.key);
                  setChapterFilter("");
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  subject === s.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm"
            >
              <option value="">All chapters</option>
              {chapters.map((c) => (
                <option key={c.chapter} value={c.chapter}>
                  {c.chapter} (Class {c.class})
                </option>
              ))}
            </select>

            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDifficultyFilter(d)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  difficultyFilter.includes(d)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                {d}
              </button>
            ))}

            <div className="relative ml-auto">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions…"
                className="h-9 w-48 pl-8"
              />
            </div>
          </div>

          <Card>
            <CardContent className="max-h-[60vh] space-y-2 overflow-y-auto p-3">
              {loadingPool || initializingExisting ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredQuestions.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No questions match these filters.
                </p>
              ) : (
                filteredQuestions.map((q) => {
                  const isSelected = selected.has(q.id);
                  return (
                    <label
                      key={q.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                        isSelected ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/30"
                      )}
                    >
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(q)} className="mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className={cn("text-[10px]", DIFFICULTY_COLORS[q.difficulty])}>
                            {q.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{q.chapter}</span>
                        </div>
                        <p className="mt-1">{q.question}</p>
                        <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={cn(
                                "flex items-center gap-1.5 rounded border px-2 py-1 text-xs",
                                i === q.correctAnswer
                                  ? "border-success bg-success/10 text-success"
                                  : "border-border/60 text-muted-foreground"
                              )}
                            >
                              <span className="font-semibold">{OPTION_LABELS[i]}.</span>
                              <span className="flex-1">{opt}</span>
                              {i === q.correctAnswer && <CheckCircle2 className="size-3.5 shrink-0" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </label>
                  );
                })
              )}
            </CardContent>
          </Card>

          {showAddForm ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Add New Question</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)} aria-label="Close form">
                  <X className="size-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <QuestionForm defaultSubject={subject} onSubmit={handleAddQuestion} submitLabel="Add to Exam" />
              </CardContent>
            </Card>
          ) : (
            <Button variant="outline" onClick={() => setShowAddForm(true)}>
              <Plus className="size-4" />
              Add New Question
            </Button>
          )}
        </div>

        <div>
          <Card className="lg:sticky lg:top-20">
            <CardHeader>
              <CardTitle className="text-base">Selected ({selected.size})</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[60vh] space-y-2 overflow-y-auto">
              {selected.size === 0 ? (
                <p className="text-sm text-muted-foreground">No questions selected yet.</p>
              ) : (
                Array.from(selected.values()).map((q) => (
                  <div
                    key={q.id}
                    className="flex items-start justify-between gap-2 rounded-lg border border-border/60 p-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{q.question}</p>
                      <p className="text-muted-foreground">
                        {q.subject} · {q.chapter}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSelect(q)}
                      aria-label="Remove from exam"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
