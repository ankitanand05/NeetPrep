"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireRole } from "@/components/auth/RequireRole";
import { ExamBuilderForm } from "@/components/dashboard/ExamBuilderForm";
import { getExamPaper } from "@/features/exams";
import type { ExamPaper } from "@/types";

export default function EditExamPage() {
  return (
    <RequireRole allow={["admin", "teacher"]}>
      <EditExamContent />
    </RequireRole>
  );
}

function EditExamContent() {
  const params = useParams<{ id: string }>();
  const [paper, setPaper] = useState<ExamPaper | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await getExamPaper(params.id);
      if (!loaded) {
        setNotFound(true);
        return;
      }
      setPaper(loaded);
    })();
  }, [params.id]);

  if (notFound) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
          Exam paper not found.
        </div>
      </AppShell>
    );
  }

  if (!paper) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ExamBuilderForm mode="edit" existingPaper={paper} />
    </AppShell>
  );
}
