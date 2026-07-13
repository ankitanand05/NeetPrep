"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLatestUnfinishedSession } from "@/hooks/useLatestSession";

export function ContinuePracticeCard() {
  const session = useLatestUnfinishedSession();

  if (!session) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <PlayCircle className="size-6" />
            </div>
            <div>
              <p className="font-semibold">Continue Practice</p>
              <p className="text-sm text-muted-foreground">
                {session.subject} · {session.chapter} · Question {session.currentIndex + 1} of{" "}
                {session.questionIds.length}
              </p>
            </div>
          </div>
          <Button render={<Link href={`/practice/${session.id}`} />}>Resume</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
