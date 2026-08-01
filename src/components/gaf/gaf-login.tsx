"use client";

/**
 * GafLogin — magic-link sign-in form for Go-A-Fishing members.
 *
 * Sends an OTP email via /api/gaf/auth/magic-link. Shows success state telling
 * the user to check their inbox.
 *
 * Stage 4 of Go-A-Fishing.
 */
import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionWrapper } from "@/components/home/section-wrapper";

const ERROR_MESSAGES: Record<string, string> = {
  magic_link_failed: "The sign-in link is invalid or has expired. Please request a new one.",
  missing_code: "The sign-in link is missing required information. Please request a new one.",
  exchange_failed: "We couldn't complete your sign-in. Please try again.",
  supabase_not_configured:
    "Sign-in is not yet available. Please contact the church administrator.",
};

interface GafLoginProps {
  error?: string;
  message?: string;
}

export function GafLogin({ error, message }: GafLoginProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/gaf/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }, [email, status]);

  const initialError = error ? (ERROR_MESSAGES[error] || message || "An error occurred.") : null;

  return (
    <section className="py-12 md:py-16 bg-[#F3E5F5] min-h-[60vh]">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <SectionWrapper>
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-br from-[#4A148C] to-[#1A0033] text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Mail className="size-5" />
                Sign in with Email
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {initialError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle className="size-5 shrink-0 mt-0.5" />
                  <p>{initialError}</p>
                </div>
              )}

              {status === "sent" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 py-6"
                >
                  <CheckCircle2 className="size-16 text-emerald-500 mx-auto" />
                  <div>
                    <h3 className="font-bold text-[#4A148C] text-lg">Check your email</h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      We sent a sign-in link to <strong>{email}</strong>. Click the
                      link in the email to sign in to your Go-A-Fishing account.
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    The link expires in 1 hour. Don&apos;t forget to check your spam folder.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStatus("idle");
                      setEmail("");
                    }}
                    className="w-full"
                  >
                    Use a different email
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-[#4A148C]">
                      Email address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === "sending"}
                      className="rounded-xl"
                    />
                  </div>

                  {status === "error" && errorMsg && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      <AlertCircle className="size-5 shrink-0 mt-0.5" />
                      <p>{errorMsg}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "sending" || !email}
                    className="w-full bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending link...
                      </>
                    ) : (
                      <>
                        <Mail className="size-4" />
                        Send sign-in link
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center leading-relaxed pt-2">
                    We&apos;ll email you a secure magic link — no password to remember.
                    New members are automatically registered.
                  </p>
                </form>
              )}

              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/go-a-fishing"
                  className="inline-flex items-center gap-1.5 text-sm text-[#4A148C] hover:underline"
                >
                  <ArrowLeft className="size-4" />
                  Back to Go-A-Fishing
                </Link>
              </div>
            </CardContent>
          </Card>
        </SectionWrapper>
      </div>
    </section>
  );
}
