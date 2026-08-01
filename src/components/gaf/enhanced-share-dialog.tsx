"use client";

/**
 * EnhancedShareDialog — rich sharing dialog with per-channel templates.
 *
 * Channels: WhatsApp (pre-filled message), Email (subject+body), Facebook,
 * X/Twitter, Telegram, Copy Link, Download QR.
 *
 * Replaces the basic ShareButton on the referral card with a full-featured
 * share sheet that generates per-platform share URLs.
 *
 * Stage 11 of Go-A-Fishing.
 */
import { useState, useMemo, useCallback } from "react";
import {
  Share2,
  MessageCircle,
  Mail,
  Facebook,
  Twitter,
  Send,
  Copy,
  Check,
  Download,
  QrCode,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EnhancedShareDialogProps {
  referralCode: string;
  baseUrl: string;
  memberName: string;
  /** Optional custom message override. */
  customMessage?: string;
  trigger?: React.ReactNode;
}

const SHARE_CHANNELS = [
  {
    id: "whatsapp" as const,
    label: "WhatsApp",
    icon: MessageCircle,
    color: "bg-[#25D366] hover:bg-[#1fb855] text-white",
    outlineColor: "border-[#25D366] text-[#1A8E3B] hover:bg-[#25D366]/10",
  },
  {
    id: "email" as const,
    label: "Email",
    icon: Mail,
    color: "bg-[#4A148C] hover:bg-[#1A0033] text-white",
    outlineColor: "border-[#4A148C] text-[#4A148C] hover:bg-[#4A148C]/5",
  },
  {
    id: "facebook" as const,
    label: "Facebook",
    icon: Facebook,
    color: "bg-[#1877F2] hover:bg-[#166FE5] text-white",
    outlineColor: "border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2]/10",
  },
  {
    id: "twitter" as const,
    label: "X / Twitter",
    icon: Twitter,
    color: "bg-black hover:bg-gray-800 text-white",
    outlineColor: "border-black text-black hover:bg-black/5",
  },
  {
    id: "telegram" as const,
    label: "Telegram",
    icon: Send,
    color: "bg-[#0088CC] hover:bg-[#0077B5] text-white",
    outlineColor: "border-[#0088CC] text-[#0088CC] hover:bg-[#0088CC]/10",
  },
] as const;

function buildShareUrl(baseUrl: string, referralCode: string): string {
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/r/${referralCode}`;
}

function buildWhatsAppUrl(url: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/?text=${encoded}%0A%0A${encodeURIComponent(url)}`;
}

function buildEmailUrl(url: string, subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}%0A%0A${encodeURIComponent(url)}`;
}

function buildFacebookUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

function buildTwitterUrl(url: string, text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

function buildTelegramUrl(url: string, message: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
}

export function EnhancedShareDialog({
  referralCode,
  baseUrl,
  memberName,
  customMessage,
  trigger,
}: EnhancedShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState(
    customMessage ||
      `You're warmly invited to worship with us at MFM Youth Church, Abuja. We'd love to see you! God bless.`
  );
  const [qrColor, setQrColor] = useState("#4A148C");

  const fullUrl = useMemo(
    () => buildShareUrl(baseUrl, referralCode),
    [baseUrl, referralCode]
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      if ("vibrate" in navigator) navigator.vibrate(50);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback.
      const ta = document.createElement("textarea");
      ta.value = fullUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fullUrl]);

  const handleDownloadQR = useCallback(() => {
    const svg = document.querySelector<SVGSVGElement>('[data-gaf-share-qr="true"]');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `mfm-referral-${referralCode}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
  }, [referralCode]);

  const handleChannelShare = useCallback(
    (channel: string) => {
      let shareUrl: string;
      switch (channel) {
        case "whatsapp":
          shareUrl = buildWhatsAppUrl(fullUrl, shareMessage);
          break;
        case "email":
          shareUrl = buildEmailUrl(
            fullUrl,
            "Invitation to MFM Youth Church",
            shareMessage
          );
          break;
        case "facebook":
          shareUrl = buildFacebookUrl(fullUrl);
          break;
        case "twitter":
          shareUrl = buildTwitterUrl(fullUrl, shareMessage);
          break;
        case "telegram":
          shareUrl = buildTelegramUrl(fullUrl, shareMessage);
          break;
        default:
          return;
      }
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    },
    [fullUrl, shareMessage]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl">
            <Share2 className="size-4" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="size-5 text-[#4A148C]" />
            Share Your Link
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Link display */}
          <div className="bg-[#F3E5F5] rounded-xl p-3 border border-[#4A148C]/10">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
              Your Referral Link
            </p>
            <p className="text-sm font-mono text-[#4A148C] break-all leading-relaxed">
              {fullUrl}
            </p>
          </div>

          {/* Channel buttons */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Share via
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SHARE_CHANNELS.map((ch) => {
                const Icon = ch.icon;
                return (
                  <Button
                    key={ch.id}
                    variant="outline"
                    className={`h-auto py-3 flex-col gap-1.5 rounded-xl ${ch.outlineColor}`}
                    onClick={() => handleChannelShare(ch.id)}
                  >
                    <Icon className="size-5" />
                    <span className="text-xs font-medium">{ch.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Copy link + Download QR row */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="gap-2 rounded-xl h-11"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="size-4 text-emerald-600" />
              ) : (
                <Copy className="size-4" />
              )}
              <span className="text-sm">
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl h-11"
              onClick={handleDownloadQR}
            >
              <Download className="size-4" />
              <span className="text-sm">QR PNG</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400">Customize</span>
            </div>
          </div>

          {/* Custom message */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Share Message
            </Label>
            <textarea
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C] resize-none"
              placeholder="Write a personal invitation message..."
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">
              {shareMessage.length}/500
            </p>
          </div>

          {/* QR color picker */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
              QR Code Color
            </Label>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {["#4A148C", "#D32F2F", "#2E7D32", "#F57F17", "#6A1B9A", "#000000"].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => setQrColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        qrColor === color
                          ? "border-[#4A148C] scale-110"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  )
                )}
              </div>
              <Input
                type="text"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="w-28 h-8 text-xs font-mono rounded-lg"
                maxLength={7}
                placeholder="#hex"
              />
            </div>
          </div>

          {/* QR Preview */}
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-2xl border-2 border-[#4A148C]/10 shadow-sm">
              <QRCodeSVG
                data-gaf-share-qr="true"
                value={fullUrl}
                size={160}
                level="M"
                bgColor="#ffffff"
                fgColor={qrColor}
                marginSize={2}
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Your referral code <span className="font-mono font-semibold text-[#4A148C]">{referralCode}</span> is
            automatically included. Share with someone you&apos;re fishing for Christ!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
