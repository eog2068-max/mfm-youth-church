"use client";

/**
 * EInviteCard — shareable e-invitation card for Go-A-Fishing.
 *
 * Generates a visually appealing HTML card that members can screenshot,
 * save as image, or share directly. Shows church branding, member name,
 * referral QR code, and service times.
 *
 * Uses html2canvas-like approach via DOM snapshot — since we can't install
 * html2canvas, the card is a styled div that members can screenshot natively
 * or use the browser's built-in share/capture.
 *
 * Stage 11 of Go-A-Fishing.
 */
import { useMemo, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EInviteCardProps {
  memberName: string;
  referralCode: string;
  baseUrl: string;
  /** Optional personal note from the inviter. */
  personalNote?: string;
}

export function EInviteCard({
  memberName,
  referralCode,
  baseUrl,
  personalNote,
}: EInviteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const fullUrl = useMemo(() => {
    const base = baseUrl.replace(/\/$/, "");
    return `${base}/r/${referralCode}`;
  }, [baseUrl, referralCode]);

  const handleDownload = useCallback(() => {
    // Same SVG-to-PNG approach as referral-card.
    const svg = cardRef.current?.querySelector<SVGSVGElement>('[data-einvite-qr="true"]');
    if (!svg || !cardRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const w = 600;
      const h = 800;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background.
      ctx.fillStyle = "#4A148C";
      ctx.fillRect(0, 0, w, h);

      // Simple text rendering (basic — for full rendering, html2canvas would be needed).
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("MFM Youth Church", w / 2, 60);

      ctx.font = "18px sans-serif";
      ctx.fillStyle = "#bbdefb";
      ctx.fillText("You're Invited!", w / 2, 95);

      // QR code.
      const qrSize = 250;
      const qrX = (w - qrSize) / 2;
      const qrY = 120;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
      URL.revokeObjectURL(url);

      // Referral code.
      ctx.fillStyle = "#bbdefb";
      ctx.font = "14px monospace";
      ctx.fillText(`Code: ${referralCode}`, w / 2, qrY + qrSize + 30);

      // Personal note.
      if (personalNote) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px sans-serif";
        // Word wrap.
        const words = personalNote.split(" ");
        let line = "";
        let y = qrY + qrSize + 70;
        for (const word of words) {
          const test = line + word + " ";
          if (ctx.measureText(test).width > w - 80) {
            ctx.fillText(line, w / 2, y);
            line = word + " ";
            y += 22;
          } else {
            line = test;
          }
        }
        ctx.fillText(line, w / 2, y);
      }

      // Service times.
      ctx.fillStyle = "#bbdefb";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("Service Times", w / 2, h - 80);
      ctx.font = "14px sans-serif";
      ctx.fillText("Sundays: 7:00 AM & 9:00 AM", w / 2, h - 55);
      ctx.fillText("Wednesdays: 6:00 PM (Bible Study)", w / 2, h - 35);

      // Bottom.
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px sans-serif";
      ctx.fillText("Scan QR or visit the link to connect", w / 2, h - 10);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `mfm-einvite-${referralCode}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
  }, [referralCode, personalNote]);

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `Invitation from ${memberName} — MFM Youth Church`,
          text: `${memberName} invites you to MFM Youth Church, Abuja. Scan the QR or tap the link to connect!`,
          url: fullUrl,
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
  }, [memberName, fullUrl]);

  return (
    <div className="space-y-4">
      {/* Card */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-[#4A148C] via-[#4A148C] to-[#1A0033] rounded-2xl p-8 text-white shadow-xl max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold">MFM Youth Church</h3>
          <p className="text-purple-200 text-sm mt-1">Abuja, Nigeria</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
            <span className="text-amber-300 font-semibold text-sm">
              You&apos;re Invited!
            </span>
          </div>
        </div>

        {/* Personal note */}
        {personalNote && (
          <div className="bg-white/10 rounded-xl p-3 mb-5 text-center">
            <p className="text-sm italic text-purple-100">
              &ldquo;{personalNote}&rdquo;
            </p>
            <p className="text-xs text-purple-200 mt-1">— {memberName}</p>
          </div>
        )}

        {/* QR Code */}
        <div className="flex justify-center mb-5">
          <div className="bg-white p-4 rounded-2xl">
            <QRCodeSVG
              data-einvite-qr="true"
              value={fullUrl}
              size={180}
              level="M"
              bgColor="#ffffff"
              fgColor="#4A148C"
              marginSize={2}
            />
          </div>
        </div>

        {/* Referral code */}
        <div className="text-center mb-5">
          <p className="text-xs text-purple-300 uppercase tracking-wider mb-1">
            Referral Code
          </p>
          <p className="text-lg font-mono font-bold text-amber-300">
            {referralCode}
          </p>
        </div>

        {/* Service times */}
        <div className="border-t border-white/10 pt-4 space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200 text-center">
            Service Times
          </h4>
          <div className="text-center text-sm space-y-0.5">
            <p>
              <span className="text-amber-300 font-medium">Sundays</span>{" "}
              &mdash; 7:00 AM &amp; 9:00 AM
            </p>
            <p>
              <span className="text-amber-300 font-medium">Wednesdays</span>{" "}
              &mdash; 6:00 PM (Bible Study)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center">
          <p className="text-xs text-purple-300">
            Scan the QR code or visit the link below
          </p>
          <p className="text-xs font-mono text-purple-200 mt-1 break-all">
            {fullUrl}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={handleDownload}
          className="gap-2 rounded-xl"
        >
          <Download className="size-4" />
          Save as Image
        </Button>
        <Button
          variant="outline"
          onClick={handleNativeShare}
          className="gap-2 rounded-xl"
        >
          <Share2 className="size-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
