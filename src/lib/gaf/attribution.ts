/**
 * Attribution cookie helpers for Go-A-Fishing referral tracking.
 *
 * When a visitor lands on `/r/[code]`, we set a cookie capturing the
 * referrer's Member ID. The cookie survives 30 days (configurable) so that
 * if the visitor later registers as a Member, we can attribute them to the
 * original referrer.
 *
 * Stage 3 of Go-A-Fishing.
 */

import type { NextResponse } from "next/server";

/** Default cookie name. Override via GAF_ATTRIBUTION_COOKIE_NAME env var. */
export const DEFAULT_COOKIE_NAME = "gaf_referrer";

/** Default attribution window in days. Override via GAF_ATTRIBUTION_WINDOW_DAYS. */
export const DEFAULT_WINDOW_DAYS = 30;

/**
 * Returns the configured cookie name (with env override applied).
 */
export function getCookieName(): string {
  return process.env.GAF_ATTRIBUTION_COOKIE_NAME || DEFAULT_COOKIE_NAME;
}

/**
 * Returns the configured attribution window in seconds.
 */
export function getWindowSeconds(): number {
  const days = Number(process.env.GAF_ATTRIBUTION_WINDOW_DAYS) || DEFAULT_WINDOW_DAYS;
  return days * 24 * 60 * 60;
}

/**
 * Sets the attribution cookie on a NextResponse (used in /r/[code] route handler).
 *
 * Cookie attributes:
 *   - path=/
 *   - max-age=2592000 (30 days, configurable)
 *   - sameSite=lax (lets the cookie survive cross-site link clicks)
 *   - secure=auto (true in production HTTPS, false on localhost)
 *   - httpOnly=true (prevents JS access — defense in depth)
 *
 * @param res     The NextResponse to attach the cookie to.
 * @param memberId The referrer's Member.id (cuid).
 */
export function setAttributionCookie(
  res: NextResponse,
  memberId: string
): void {
  res.cookies.set({
    name: getCookieName(),
    value: memberId,
    path: "/",
    maxAge: getWindowSeconds(),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
}

/**
 * Reads the attribution cookie from a Next.js `cookies()` store (server-side).
 *
 * @returns The referrer's Member.id, or null if not set / expired.
 *
 * @example
 *   import { cookies } from "next/headers";
 *   const referrerId = await getReferrerFromCookie();
 */
export async function getReferrerFromCookie(): Promise<string | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const value = cookieStore.get(getCookieName())?.value;
  return value || null;
}

/**
 * Reads the attribution cookie from a raw Request (used in middleware / route
 * handlers that have access to the raw Request object).
 */
export function getReferrerFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const target = `${getCookieName()}=`;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(target)) {
      return decodeURIComponent(trimmed.slice(target.length));
    }
  }
  return null;
}

/**
 * Clears the attribution cookie. Called after a visitor successfully registers
 * as a Member and is attributed to a referrer (so we don't double-attribute
 * on subsequent visits).
 */
export function clearAttributionCookie(res: NextResponse): void {
  res.cookies.set({
    name: getCookieName(),
    value: "",
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
}
