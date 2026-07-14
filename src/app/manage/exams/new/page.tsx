"use client";

import { AppShell } from "@/components/layout/AppShell";
import { RequireRole } from "@/components/auth/RequireRole";
import { ExamBuilderForm } from "@/components/dashboard/ExamBuilderForm";

export default function NewExamPage() {
  return (
    <RequireRole allow={["admin", "teacher"]}>
      <AppShell>
        <ExamBuilderForm mode="create" />
      </AppShell>
    </RequireRole>
  );
}
