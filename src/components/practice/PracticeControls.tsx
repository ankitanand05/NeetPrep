"use client";

import { useState } from "react";
import { Bookmark, Flag, RotateCcw, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface PracticeControlsProps {
  isFirst: boolean;
  isLast: boolean;
  isMarked: boolean;
  isBookmarked: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onClear: () => void;
  onToggleMark: () => void;
  onToggleBookmark: () => void;
  onSubmit: () => void;
}

export function PracticeControls({
  isFirst,
  isLast,
  isMarked,
  isBookmarked,
  onPrevious,
  onNext,
  onClear,
  onToggleMark,
  onToggleBookmark,
  onSubmit,
}: PracticeControlsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onToggleBookmark}>
          <Bookmark className={cn("size-4", isBookmarked && "fill-primary text-primary")} />
          Bookmark
        </Button>
        <Button variant={isMarked ? "default" : "outline"} onClick={onToggleMark}>
          <Flag className="size-4" />
          Mark for Review
        </Button>
        <Button variant="outline" onClick={onClear}>
          <RotateCcw className="size-4" />
          Clear Response
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onPrevious} disabled={isFirst}>
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        {isLast ? (
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger render={<Button />}>
              <Send className="size-4" />
              Submit
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit practice session?</AlertDialogTitle>
                <AlertDialogDescription>
                  You won&apos;t be able to change your answers after submitting. Unanswered questions will be
                  marked as skipped.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onSubmit}>Submit</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button onClick={onNext}>
            Next
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
