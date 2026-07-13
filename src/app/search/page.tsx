"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";
import { AppShell } from "@/components/layout/AppShell";
import { getAllQuestions } from "@/features/questions";
import { toggleBookmark } from "@/features/practice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Bookmark, ChevronDown, ChevronUp, AlertTriangle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question, Subject, Difficulty, QuestionTag } from "@/types";

const SUBJECTS: Subject[] = ["Physics", "Chemistry", "Botany", "Zoology"];
const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const OPTION_LABELS = ["A", "B", "C", "D"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All");
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Fetch bookmarks reactively from Dexie
  const bookmarkedIds = useLiveQuery(
    async () => {
      const list = await db.bookmarks.toArray();
      return new Set(list.map((b) => b.questionId));
    },
    [],
    new Set<string>()
  );

  const allQuestions = useMemo(() => getAllQuestions(), []);

  // Filter first, then fuse search
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (selectedSubject !== "All" && q.subject !== selectedSubject) return false;
      if (selectedDifficulty !== "All" && q.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [allQuestions, selectedSubject, selectedDifficulty]);

  // Fuse search configuration
  const fuse = useMemo(() => {
    return new Fuse(filteredQuestions, {
      keys: ["question", "chapter", "topic", "unit", "solution"],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [filteredQuestions]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return filteredQuestions;
    return fuse.search(query).map((res) => res.item);
  }, [filteredQuestions, fuse, query]);

  async function handleToggleBookmark(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    await toggleBookmark(id);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Search Questions</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Search across {allQuestions.length} practice questions using fuzzy text, subjects, or difficulty tags.
          </p>
        </div>

        {/* Search controls */}
        <div className="grid gap-4 rounded-2xl border border-border/40 bg-card p-4 md:p-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Type topic, chapter, or question keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/60 bg-background pl-11 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/30">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Filter className="size-3.5" /> Filter by:
            </span>

            {/* Subject Filters */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedSubject("All")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                  selectedSubject === "All"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                All Subjects
              </button>
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSubject(s)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                    selectedSubject === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-border/85 hidden md:block" />

            {/* Difficulty Filters */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedDifficulty("All")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                  selectedDifficulty === "All"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                All Levels
              </button>
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                    selectedDifficulty === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
          <span>
            Showing {searchResults.length} of {filteredQuestions.length} matching questions
          </span>
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedSubject("All");
                setSelectedDifficulty("All");
              }}
              className="text-primary hover:underline font-semibold cursor-pointer"
            >
              Clear search criteria
            </button>
          )}
        </div>

        {/* Question list */}
        {searchResults.length === 0 ? (
          <Card className="border-dashed py-12 text-center">
            <CardContent className="flex flex-col items-center justify-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <AlertTriangle className="size-6" />
              </div>
              <h3 className="font-semibold text-base">No questions match your filters</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Try widening your search terms or selecting &quot;All Subjects&quot; / &quot;All Levels&quot;.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {searchResults.map((q) => {
              const isExpanded = expandedQuestionId === q.id;
              const isBookmarked = bookmarkedIds.has(q.id);

              return (
                <Card
                  key={q.id}
                  className={cn(
                    "border-border/50 hover:border-border transition-all duration-200 cursor-pointer overflow-hidden",
                    isExpanded && "ring-1 ring-primary/20 bg-muted/10"
                  )}
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                >
                  <CardContent className="p-4 md:p-5 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="font-semibold text-[10px]">
                          {q.subject}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "font-semibold text-[10px]",
                            q.difficulty === "Easy" && "bg-success/10 text-success border-success/20",
                            q.difficulty === "Medium" && "bg-warning/10 text-warning border-warning/20",
                            q.difficulty === "Hard" && "bg-destructive/10 text-destructive border-destructive/20"
                          )}
                        >
                          {q.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-xs">
                          {q.chapter} · {q.topic}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => handleToggleBookmark(q.id, e)}
                          className="rounded-lg p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Bookmark Question"
                        >
                          <Bookmark className={cn("size-4", isBookmarked && "fill-primary text-primary")} />
                        </button>
                        <div>
                          {isExpanded ? (
                            <ChevronUp className="size-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="size-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Question Text */}
                    <p className="text-sm font-medium leading-relaxed text-foreground select-all">
                      {q.question}
                    </p>

                    {/* Expandable options and solutions */}
                    {isExpanded && (
                      <div className="pt-4 border-t border-border/30 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Options */}
                        <div className="grid gap-2">
                          {q.options.map((option, optIdx) => {
                            const isCorrect = optIdx === q.correctAnswer;
                            return (
                              <div
                                key={optIdx}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg border px-4 py-2.5 text-xs font-medium",
                                  isCorrect ? "border-success/30 bg-success/5 text-success-foreground" : "border-border/80"
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                                    isCorrect ? "border-success bg-success/15" : "border-border text-muted-foreground"
                                  )}
                                >
                                  {OPTION_LABELS[optIdx]}
                                </span>
                                <span className="flex-1 text-foreground/90">{option}</span>
                                {isCorrect && (
                                  <Badge className="bg-success hover:bg-success text-success-foreground text-[9px] font-semibold py-0 px-1.5 leading-tight">
                                    Correct Answer
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {q.solution && (
                          <div className="rounded-xl bg-muted/60 p-4 border border-border/40 text-xs">
                            <h4 className="font-bold text-foreground mb-1 flex items-center gap-1.5">
                              <BookOpen className="size-3.5 text-primary" /> Answer Explanation
                            </h4>
                            <p className="text-muted-foreground leading-relaxed leading-normal select-all">
                              {q.solution}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
