"use client";

/**
 * Reusable ShareButton — uses Web Share API where available, falls back to
 * clipboard copy + toast.
 *
 * Solves the "no Web Share API usage" finding from Stage 1 audit. Any future
 * feature that needs a share button should use this component.
 *
 * Stage 4 of Go-A-Fishing.
 */
import { useState, useCallback, useEffect } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ShareButtonProps
  extends Omit<ButtonProps, "onClick" | "children"> {
  /** URL to share. Defaults to window.location.href. */
  url?: string;
  /** Title for native share sheet. */
  title?: string;
  /** Text body for native share sheet / clipboard fallback. */
  text?: string;
  /** Label shown on the button. */
  label?: string;
  /** Show the label or icon-only. */
  showLabel?: boolean;
  /** Visual variant. */
  variant?: ButtonProps["variant"];
}

export function ShareButton({
  url,
  title = "MFM Youth Church",
  text = "Join me at MFM Rehoborth Assembly!",
  label = "Share",
  showLabel = true,
  variant = "outline",
  className,
  ...rest
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  // Detect Web Share API support on mount (client-only).
  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanShare(true);
    }
  }, []);

  const handleShare = useCallback(async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    // Try native share first.
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed — fall through to clipboard.
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    // Fallback: clipboard copy.
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        if ("vibrate" in navigator) navigator.vibrate(50);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Final fallback: legacy execCommand.
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } finally {
          document.body.removeChild(textarea);
        }
      }
    }
  }, [url, title, text]);

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleShare}
      className={cn("gap-2", className)}
      {...rest}
    >
      {copied ? (
        <>
          <Check className="size-4" />
          {showLabel && <span>Copied!</span>}
        </>
      ) : (
        <>
          {canShare ? <Share2 className="size-4" /> : <Copy className="size-4" />}
          {showLabel && <span>{label}</span>}
        </>
      )}
      <span className="sr-only" role="status">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </Button>
  );
}
