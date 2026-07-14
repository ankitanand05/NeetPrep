"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, LogIn, ShieldCheck, Users, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { ROLE_HOME, ROLE_LABELS, type Role } from "@/constants/auth";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: { role: Role; icon: typeof ShieldCheck }[] = [
  { role: "student", icon: GraduationCap },
  { role: "teacher", icon: Users },
  { role: "admin", icon: ShieldCheck },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [role, setRole] = useState<Role>("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const success = login(username, password, role);
    if (!success) {
      setError(`Invalid username or password for ${ROLE_LABELS[role]}.`);
      setSubmitting(false);
      return;
    }

    router.replace(ROLE_HOME[role]);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background/50 px-4 py-12 antialiased transition-colors duration-300">
      {/* Floating Theme Toggle in Top Right */}
      <div className="absolute right-4 top-4 z-50 rounded-xl border border-border/40 bg-card/60 p-1 shadow-sm backdrop-blur-md">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[400px] z-10"
      >
        {/* Brand/Logo Area */}
        <div className="mb-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-accent text-primary-foreground text-lg font-black shadow-md shadow-primary/10"
          >
            N
          </motion.div>
          <h1 className="mt-4 text-xl font-bold tracking-tight">Sign in to NEETPREP</h1>
          <p className="mt-1 text-xs text-muted-foreground">Select your role and enter your credentials.</p>
        </div>

        <Card className="border-border/50 bg-card/90 shadow-lg shadow-foreground/5 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold">Welcome Back</CardTitle>
            <CardDescription className="text-[11px]">Choose your profile category below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sliding Role Selector Tabs */}
            <div className="relative flex rounded-xl bg-muted p-1 border border-border/30">
              {ROLE_OPTIONS.map((opt) => {
                const isSelected = role === opt.role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => {
                      setRole(opt.role);
                      setError(null);
                    }}
                    className={cn(
                      "relative flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none z-10 rounded-lg",
                      isSelected ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {/* Sliding Background Pill */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeRoleTab"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="absolute inset-0 bg-background rounded-lg border border-border/30 shadow-sm z-[-1]"
                      />
                    )}
                    <opt.icon className="size-4" />
                    <span>{ROLE_LABELS[opt.role]}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="name@email.com or username"
                  className="h-10 w-full rounded-lg border border-border/80 bg-background px-3 text-xs outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-lg border border-border/80 bg-background pl-3 pr-10 text-xs outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs font-semibold text-destructive mt-1"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button type="submit" className="w-full h-9 text-xs cursor-pointer" disabled={submitting}>
                <LogIn className="size-4" />
                Sign in as {ROLE_LABELS[role]}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
