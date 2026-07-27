/**
 * Server-side auth helper for Go-A-Fishing.
 *
 * Bridges Supabase Auth (identity) and Prisma (relational data). Returns the
 * Go-A-Fishing Member record for the currently-authenticated user, or null.
 *
 * Stage 3 of Go-A-Fishing.
 */

import { db } from "@/lib/db";
import { getSupabaseServer } from "./supabase-server";

/**
 * Returns the Supabase Auth user for the current request, or null.
 *
 * Server-only. Reads session from cookies via @supabase/ssr.
 */
export async function getCurrentSupabaseUser() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Returns the Go-A-Fishing Member record for the currently-authenticated user.
 *
 * Joins Supabase Auth identity → Prisma Member via `Member.supabaseUserId`.
 * Returns null if:
 *   - No Supabase session exists (user not logged in).
 *   - Supabase user exists but has no corresponding Member record (e.g. they
 *     signed up but haven't completed member onboarding — Stage 4 will handle
 *     this by auto-creating a Member on first dashboard visit).
 *
 * @example
 *   const member = await getCurrentMember();
 *   if (!member) redirect("/go-a-fishing/login");
 */
export async function getCurrentMember() {
  const user = await getCurrentSupabaseUser();
  if (!user) return null;

  const member = await db.member.findUnique({
    where: { supabaseUserId: user.id },
    include: {
      referralsMade: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      rewardWinners: {
        include: { cycle: { include: { category: true } } },
        orderBy: { awardedAt: "desc" },
      },
      commendations: {
        where: { visibility: { in: ["public", "members_only"] } },
        orderBy: { awardedAt: "desc" },
        take: 5,
      },
    },
  });

  return member;
}

/**
 * Returns just the Member ID for the current user (lightweight — no joins).
 * Use this when you only need the ID for permission checks.
 */
export async function getCurrentMemberId(): Promise<string | null> {
  const user = await getCurrentSupabaseUser();
  if (!user) return null;

  const member = await db.member.findUnique({
    where: { supabaseUserId: user.id },
    select: { id: true, status: true },
  });

  return member?.status === "active" ? member.id : null;
}

/**
 * Returns true if the current user has the given role.
 *
 * Roles are stored in Supabase Auth `app_metadata.role`. Initially two roles
 * exist: "member" (default) and "admin" (set manually in Supabase dashboard).
 * Stage 6 will add "pastor" role.
 *
 * @example
 *   if (!(await hasRole("admin"))) return new Response("Forbidden", { status: 403 });
 */
export async function hasRole(role: "admin" | "pastor" | "member"): Promise<boolean> {
  const user = await getCurrentSupabaseUser();
  if (!user) return false;

  const userRole = (user.app_metadata?.role as string) || "member";
  if (role === "member") return true; // any logged-in user is at least a member
  return userRole === role;
}

/**
 * Returns true if the current user is an admin OR a pastor.
 * Pastors have most admin privileges except AdminConfig editing.
 */
export async function isAdminOrPastor(): Promise<boolean> {
  return (await hasRole("admin")) || (await hasRole("pastor"));
}

/**
 * Requires the current user to have the given role. Throws a 403-style error
 * if not. Useful as a one-liner guard at the top of API route handlers.
 *
 * @example
 *   await requireRole("admin");
 *   // ... rest of handler
 */
export async function requireRole(
  role: "admin" | "pastor" | "member"
): Promise<void> {
  const ok = await hasRole(role);
  if (!ok) {
    throw new Response("Forbidden", { status: 403 });
  }
}

/**
 * Requires the current user to be authenticated. Returns the Member record.
 * Throws a 401-style error if not logged in.
 *
 * @example
 *   const member = await requireMember();
 */
export async function requireMember() {
  const member = await getCurrentMember();
  if (!member) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return member;
}
