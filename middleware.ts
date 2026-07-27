/**
 * Next.js middleware — Supabase Auth session refresh.
 *
 * Refreshes the user's Supabase Auth session on every request by reading the
 * session cookie, validating it, and writing a refreshed cookie back to the
 * response. Without this middleware, server components would lose the session
 * after the JWT expires.
 *
 * Scope: ALL routes. The middleware is cheap (cookie read + JWT verify) and
 * skips work if no session cookie exists.
 *
 * Stage 4 of Go-A-Fishing.
 */
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Routes that bypass the Supabase session refresh. These are static assets
 * and API paths that don't need auth context.
 */
const EXCLUDED_PATTERNS = [
  /\/_next\//,
  /\/static\//,
  /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf|txt|xml)$/,
  /\/api\/social\//, // existing social API routes use their own auth
];

export async function middleware(req: NextRequest) {
  // Skip excluded routes.
  if (EXCLUDED_PATTERNS.some((p) => p.test(req.nextUrl.pathname))) {
    return NextResponse.next();
  }

  // If Supabase env vars aren't set yet (pre-provisioning), skip middleware
  // entirely — Stage 4 UI gracefully degrades to "logged out" state.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next({
    request: {
      headers: new Headers(req.headers),
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              res.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // getUser() refreshes the session if needed and writes cookies via
    // the setAll callback above.
    await supabase.auth.getUser();
  } catch {
    // If anything goes wrong (network, malformed cookie, etc.), let the
    // request proceed — server components will treat the user as logged out.
  }

  return res;
}

export const config = {
  matcher: [
    // Run on all routes except Next internals and static assets.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf|txt|xml)).*)",
  ],
};
