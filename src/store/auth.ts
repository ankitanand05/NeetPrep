import { create } from "zustand";
import { persist } from "zustand/middleware";
import { USERS, type Role } from "@/constants/auth";

export interface AuthUser {
  username: string;
  name: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  hasHydrated: boolean;
  login: (username: string, password: string, role: Role) => boolean;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      login: (username, password, role) => {
        const match = USERS.find(
          (u) =>
            u.username.toLowerCase() === username.trim().toLowerCase() &&
            u.password === password &&
            u.role === role
        );
        if (!match) return false;
        set({ user: { username: match.username, name: match.name, role: match.role } });
        return true;
      },
      logout: () => set({ user: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "neet-auth",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
