export type Role = "admin" | "teacher" | "student";

export interface HardcodedUser {
  username: string;
  password: string;
  role: Role;
  name: string;
}

/**
 * No backend exists — credentials are intentionally hardcoded for this prototype.
 * Swap this for a real auth provider before shipping to real users.
 *
 * Admin and Teacher were requested with the same email/password. Login now
 * requires picking a role up front and validates username+password+role
 * together, so the same credentials can resolve to either role depending on
 * what the user selects at sign-in.
 */
export const USERS: HardcodedUser[] = [
  { username: "ankitanand8969@gmail.com", password: "Ankitanand@8969", role: "admin", name: "Admin" },
  { username: "ankitanand8969@gmail.com", password: "Ankitanand@8969", role: "teacher", name: "Teacher" },
  { username: "satyam", password: "Satyam@123", role: "student", name: "Satyam" },
  { username: "Shambhavi", password: "Shambhavi@123", role: "student", name: "Shambhavi" },
];

export const ROLE_HOME: Record<Role, string> = {
  admin: "/dashboard",
  teacher: "/manage/questions",
  student: "/dashboard",
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
};
