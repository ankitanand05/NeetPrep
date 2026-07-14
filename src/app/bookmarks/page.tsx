"use client";

import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";
import { AppShell } from "@/components/layout/AppShell";
import { getMergedQuestionsByIds } from "@/features/questions";
import { createPracticeSession, saveSession, toggleBookmark } from "@/features/practice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Play, Trash2, BookOpen, ChevronRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Question, Subject } from "@/types";

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function BookmarksPage() {
  const router = useRouter();
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Load bookmarks dynamically from Dexie
  const bookmarkedQuestions = useLiveQuery(async () => {
    const bookmarkRecords = await db.bookmarks.toArray();
    const ids = bookmarkRecords.map((b) => b.questionId);
    return getMergedQuestionsByIds(ids);
  }, [], [] as Question[]);

  // Group bookmarks by subject and then by chapter
  const groupedBookmarks = useMemo(() => {
    const groups: Record<Subject, Record<string, Question[]>> = {
      Physics: {},
      Chemistry: {},
      Botany: {},
      Zoology: {},
    };

    for (const q of bookmarkedQuestions) {
      if (!groups[q.subject][q.chapter]) {
        groups[q.subject][q.chapter] = [];
      }
      groups[q.subject][q.chapter].push(q);
    }

    // Filter out subjects/chapters with no bookmarks
    const filteredGroups: Record<string, Record<string, Question[]>> = {};
    for (const subject of Object.keys(groups)) {
      const chapters = groups[subject as Subject];
      if (Object.keys(chapters).length > 0) {
        filteredGroups[subject] = chapters;
      }
    }

    return filteredGroups;
  }, [bookmarkedQuestions]);

  async function handleRemoveBookmark(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    await toggleBookmark(id);
    toast.success("Bookmark removed");
  }

  async function startPracticeSession(questionsToPractice: Question[], title: string) {
    if (questionsToPractice.length === 0) return;
    try {
      // Pick subject and chapter from the first question
      const firstQ = questionsToPractice[0];
      const session = createPracticeSession({
        subject: firstQ.subject,
        chapter: title, // Use custom title or chapter name
        mode: "bookmarks",
        questions: questionsToPractice,
        shuffleQuestions: true,
      });
      await saveSession(session);
      router.push(`/practice/${session.id}`);
    } catch (err) {
      toast.error("Failed to start practice session");
    }
  }

  const hasBookmarks = bookmarkedQuestions.length > 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Bookmarked Questions</h1>
            <p className="mt-1 text-muted-foreground text-sm">
              Review and practice questions you saved for review.
            </p>
          </div>
          {hasBookmarks && (
            <Button
              onClick={() => startPracticeSession(bookmarkedQuestions, "All Bookmarks")}
              className="w-full md:w-auto cursor-pointer"
            >
              <Play className="size-4" /> Practice All Bookmarks ({bookmarkedQuestions.length})
            </Button>
          )}
        </div>

        {!hasBookmarks ? (
          <Card className="border-dashed py-16 text-center">
            <CardContent className="flex flex-col items-center justify-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Bookmark className="size-7 text-muted-foreground/60" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">No bookmarked questions yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1 mx-auto">
                  Bookmark questions during practice sessions or from the Search page to review them here later.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedBookmarks).map(([subject, chapters]) => (
              <div key={subject} className="space-y-4">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40 pb-2">
                  {subject}
                </h2>

                <div className="space-y-4">
                  {Object.entries(chapters).map(([chapter, questions]) => (
                    <Card key={chapter} className="border-border/40 bg-card overflow-hidden">
                      <div className="bg-muted/30 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/30">
                        <div className="flex items-center gap-2">
                          <BookOpen className="size-4 text-primary shrink-0" />
                          <h3 className="font-semibold text-xs text-foreground leading-tight truncate max-w-xs sm:max-w-md md:max-w-lg">
                            {chapter}
                          </h3>
                          <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-5 font-semibold">
                            {questions.length}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startPracticeSession(questions, chapter)}
                          className="h-8 text-[11px] font-semibold text-primary hover:text-primary hover:bg-primary/5 cursor-pointer self-start sm:self-auto"
                        >
                          <Play className="size-3.5 mr-1" /> Practice Chapter Bookmarks
                        </Button>
                      </div>

                      <div className="divide-y divide-border/30">
                        {questions.map((q) => {
                          const isExpanded = expandedQuestionId === q.id;

                          return (
                            <div
                              key={q.id}
                              className={cn(
                                "p-4 transition-colors hover:bg-muted/10 cursor-pointer",
                                isExpanded && "bg-muted/20"
                              )}
                              onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-2 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                      variant="secondary"
                                      className={cn(
                                        "font-semibold text-[9px] py-0 px-1",
                                        q.difficulty === "Easy" && "bg-success/10 text-success border-success/20",
                                        q.difficulty === "Medium" && "bg-warning/10 text-warning border-warning/20",
                                        q.difficulty === "Hard" && "bg-destructive/10 text-destructive border-destructive/20"
                                      )}
                                    >
                                      {q.difficulty}
                                    </Badge>
                                    <span className="text-[11px] text-muted-foreground truncate">
                                      {q.topic}
                                    </span>
                                  </div>
                                  <p className="text-xs font-semibold leading-relaxed text-foreground select-all">
                                    {q.question}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={(e) => handleRemoveBookmark(q.id, e)}
                                    className="rounded-lg p-1.5 hover:bg-muted text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                    title="Remove Bookmark"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                  <div>
                                    {isExpanded ? (
                                      <ChevronDown className="size-4 rotate-180 text-muted-foreground transition-transform duration-200" />
                                    ) : (
                                      <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="mt-4 border-t border-border/30 pt-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                  {/* Options */}
                                  <div className="grid gap-2">
                                    {q.options.map((option, optIdx) => {
                                      const isCorrect = optIdx === q.correctAnswer;
                                      return (
                                        <div
                                          key={optIdx}
                                          className={cn(
                                            "flex items-center gap-3 rounded-lg border px-4 py-2 text-xs font-medium",
                                            isCorrect ? "border-success/30 bg-success/5 text-success-foreground" : "border-border/80"
                                          )}
                                        >
                                          <span
                                            className={cn(
                                              "flex size-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold",
                                              isCorrect ? "border-success bg-success/15" : "border-border text-muted-foreground"
                                            )}
                                          >
                                            {OPTION_LABELS[optIdx]}
                                          </span>
                                          <span className="flex-1 text-foreground/90">{option}</span>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Explanation */}
                                  {q.solution && (
                                    <div className="rounded-xl bg-muted/60 p-4 border border-border/40 text-xs">
                                      <h4 className="font-bold text-foreground mb-1">Explanation</h4>
                                      <p className="text-muted-foreground leading-relaxed select-all">
                                        {q.solution}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
