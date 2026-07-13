"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";
import { AppShell } from "@/components/layout/AppShell";
import { getOverallStats } from "@/features/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPercent, formatTime } from "@/lib/format";
import { getQuestionsForSubject } from "@/features/questions";
import {
  User,
  Target,
  Trophy,
  Flame,
  Clock,
  CheckCircle,
  Save,
  Trash2,
  CheckCircle2,
  XCircle,
  Percent,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { AppSettings, Subject } from "@/types";

const SUBJECTS: Subject[] = ["Physics", "Chemistry", "Botany", "Zoology"];

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [dailyGoal, setDailyGoal] = useState(20);
  const [targetScore, setTargetScore] = useState(650);
  const [saving, setSaving] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Fetch overall statistics reactively
  const stats = useLiveQuery(() => getOverallStats());

  // Fetch settings once mounted
  useEffect(() => {
    (async () => {
      const stored = await db.settings.get("settings");
      if (stored) {
        setName(stored.name || "");
        setDailyGoal(stored.dailyGoal || 20);
        setTargetScore(stored.targetScore || 650);
      }
    })();
  }, []);

  // Compute subject wise accuracy
  const subjectStats = useLiveQuery(async () => {
    const completed = await db.completedQuestions.toArray();
    const results: Record<Subject, { total: number; correct: number; accuracy: number }> = {
      Physics: { total: 0, correct: 0, accuracy: 0 },
      Chemistry: { total: 0, correct: 0, accuracy: 0 },
      Botany: { total: 0, correct: 0, accuracy: 0 },
      Zoology: { total: 0, correct: 0, accuracy: 0 },
    };

    // Index all questions for fast lookup
    const allQs = await Promise.all(
      completed.map(async (row) => {
        const q = (await db.completedQuestions.get(row.questionId)) as any;
        return row;
      })
    );

    // Filter questions by subject by looking at metadata
    for (const row of completed) {
      // Find subject of question
      // We can scan manifest questions since we have getQuestionsForSubject
      for (const subject of SUBJECTS) {
        const subjectQuestions = getQuestionsForSubject(subject);
        if (subjectQuestions.some((q) => q.id === row.questionId)) {
          results[subject].total += 1;
          if (row.correct) {
            results[subject].correct += 1;
          }
          break;
        }
      }
    }

    // Calculate accuracy percentage
    for (const subject of SUBJECTS) {
      const data = results[subject];
      data.accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
    }

    return results;
  }, [stats]);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const update: AppSettings = {
        id: "settings",
        name: name.trim() || "Aspirant",
        dailyGoal: Number(dailyGoal) || 20,
        targetScore: Number(targetScore) || 650,
        theme: "system", // Handled globally by next-themes
      };
      await db.settings.put(update);
      toast.success("Settings updated successfully!");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function handleResetData() {
    try {
      await Promise.all([
        db.bookmarks.clear(),
        db.completedQuestions.clear(),
        db.wrongQuestions.clear(),
        db.practiceSessions.clear(),
        db.streaks.clear(),
      ]);
      toast.success("All practice progress has been reset.");
      setResetConfirm(false);
    } catch (err) {
      toast.error("Failed to reset progress");
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Profile & Performance</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Manage your daily targets and review your overall NEET preparation statistics.
          </p>
        </div>

        {/* Stats Summary Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="border-border/40 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Solved</p>
                <p className="text-lg font-bold">{stats?.totalCompleted || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Accuracy</p>
                <p className="text-lg font-bold">{formatPercent(stats?.accuracy || 0)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <Flame className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Streak</p>
                <p className="text-lg font-bold">{stats?.currentStreak || 0} days</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Avg Time / Q</p>
                <p className="text-lg font-bold">{stats?.avgTimeSec ? formatTime(stats.avgTimeSec) : "—"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Settings Section */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Aspirant Settings</CardTitle>
                <CardDescription className="text-xs">
                  Customize your daily study goals and target NEET metrics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold text-muted-foreground" htmlFor="student-name">
                      Candidate Name
                    </label>
                    <input
                      id="student-name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border/80 bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-muted-foreground" htmlFor="daily-goal">
                        Daily Questions Target
                      </label>
                      <input
                        id="daily-goal"
                        type="number"
                        min="1"
                        max="200"
                        value={dailyGoal}
                        onChange={(e) => setDailyGoal(Number(e.target.value))}
                        className="h-10 w-full rounded-lg border border-border/80 bg-background px-3 text-sm outline-none transition-all focus:border-primary"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-muted-foreground" htmlFor="target-score">
                        Target NEET Score (out of 720)
                      </label>
                      <input
                        id="target-score"
                        type="number"
                        min="100"
                        max="720"
                        value={targetScore}
                        onChange={(e) => setTargetScore(Number(e.target.value))}
                        className="h-10 w-full rounded-lg border border-border/80 bg-background px-3 text-sm outline-none transition-all focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={saving} className="h-9 text-xs cursor-pointer">
                      <Save className="size-4" />
                      {saving ? "Saving…" : "Save Settings"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Safety Actions */}
            <Card className="border-border/40 border-destructive/20 shadow-sm bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="size-5 shrink-0" /> Danger Zone
                </CardTitle>
                <CardDescription className="text-xs text-destructive/80">
                  Actions here are permanent and cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!resetConfirm ? (
                  <Button
                    variant="outline"
                    onClick={() => setResetConfirm(true)}
                    className="border-destructive/30 hover:bg-destructive/10 text-destructive text-xs cursor-pointer h-9"
                  >
                    <Trash2 className="size-4" /> Reset Practice Progress
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-destructive">
                      Are you absolutely sure? This will wipe your bookmarks, history, scores, and streaks.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={handleResetData}
                        className="text-xs cursor-pointer h-9"
                      >
                        Yes, Reset Everything
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setResetConfirm(false)}
                        className="text-xs cursor-pointer h-9"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Subject Stats Panel */}
          <div>
            <Card className="border-border/40 shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Subject Performance</CardTitle>
                <CardDescription className="text-xs">
                  Your accuracy rate across the NEET domains.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {SUBJECTS.map((subject) => {
                  const data = subjectStats?.[subject] || { total: 0, correct: 0, accuracy: 0 };

                  return (
                    <div key={subject} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">{subject}</span>
                        <span className="text-muted-foreground">
                          {data.total > 0
                            ? `${data.correct}/${data.total} (${formatPercent(data.accuracy)})`
                            : "No practice yet"}
                        </span>
                      </div>
                      {/* Custom Progress Bar */}
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            subject === "Physics" && "bg-primary",
                            subject === "Chemistry" && "bg-warning",
                            subject === "Botany" && "bg-success",
                            subject === "Zoology" && "bg-destructive"
                          )}
                          style={{ width: `${Math.min(data.accuracy, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
