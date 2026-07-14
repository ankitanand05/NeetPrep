"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import type { Role } from "@/constants/auth";

export function RequireRole({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const isAllowed = Boolean(user && allow.includes(user.role));

  useEffect(() => {
    if (user && !isAllowed) {
      toast.error("You don't have access to that page.");
      router.replace("/dashboard");
    }
  }, [user, isAllowed, router]);

  if (!isAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
