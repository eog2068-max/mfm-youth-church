"use client";

/**
 * ReferralCard — shows the member their personal referral link + QR code
 * with copy / share / download buttons.
 *
 * Stage 4 of Go-A-Fishing. Updated in Stage 11 to use EnhancedShareDialog.
 */
import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareButton } from "./share-button";
import { EnhancedShareDialog } from "./enhanced-share-dialog";

interface ReferralCardProps {
  /** The member's referral code, e.g. "REH-AB1234". */
  referralCode: string;
  /** The base URL for link generation (without trailing slash). */
  baseUrl: string;
  /** Member's name for the share text. */
  memberName: string;
}

export function ReferralCard({
  referralCode,
  baseUrl,
  memberName,
}: ReferralCardProps) {
  const fullUrl = useMemo(() => {
    // Strip trailing slash from base URL.
    const base = baseUrl.replace(/\/$/, "");
    return `${base}/r/${referralCode}`;
  }, [baseUrl, referralCode]);

  const handleDownload = () => {
    // Find the rendered SVG and convert to PNG via canvas.
    const svg = document.querySelector<SVGSVGElement>('[data-gaf-qr="true"]');
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
        a.download = `mfm-youth-church-referral-${referralCode}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
  };

  return (
    <Card className="overflow-hidden border-[#4A148C]/20">
      <CardHeader className="bg-gradient-to-br from-[#4A148C] to-[#1A0033] text-white">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link2 className="size-5" />
          Your Referral Link
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-2xl border-2 border-[#4A148C]/10 shadow-sm">
            <QRCodeSVG
              data-gaf-qr="true"
              value={fullUrl}
              size={200}
              level="M"
              bgColor="#ffffff"
              fgColor="#4A148C"
              marginSize={2}
            />
          </div>
        </div>

        {/* Link display */}
        <div className="bg-[#F3E5F5] rounded-xl p-3 border border-[#4A148C]/10">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
            Your link
          </p>
          <p className="text-sm font-mono text-[#4A148C] break-all leading-relaxed">
            {fullUrl}
          </p>
        </div>

        {/* Action buttons — EnhancedShareDialog replaces old share row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <EnhancedShareDialog
            referralCode={referralCode}
            baseUrl={baseUrl}
            memberName={memberName}
            trigger={
              <button className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-[#4A148C] hover:bg-[#1A0033] text-white text-sm font-medium transition-colors">
                <Link2 className="size-4" />
                Share
              </button>
            }
          />
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium transition-colors w-full"
          >
            <Download className="size-4" />
            <span>QR PNG</span>
          </button>
          <ShareButton
            url={fullUrl}
            label="WhatsApp"
            showLabel
            variant="outline"
            className="w-full border-[#25D366] text-[#1A8E3B] hover:bg-[#25D366]/10 rounded-xl"
            title="Join me at MFM Youth Church"
            text={`Hi! ${memberName} invites you to worship with us at MFM Youth Church, Abuja. Tap: ${fullUrl}`}
          />
        </div>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Share this link or QR code with someone you&apos;re fishing for Christ.
          When they visit and attend a service, you&apos;ll be credited.
        </p>
      </CardContent>
    </Card>
  );
}
