import Link from "next/link";
import { Building2, CreditCard, QrCode, ArrowRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SectionTitle } from "./section-wrapper";

export function GivingSection() {
  return (
    <SectionWrapper className="bg-[#FFF8F0] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle
          title="Give to the Lord"
          subtitle="Your generous giving supports the work of the ministry"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {/* Bank Transfer */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-gray-100">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center mb-4">
              <Building2 className="size-6 text-[#2E7D32]" />
            </div>
            <h3 className="text-lg font-bold text-[#4A148C] mb-3">Bank Transfer</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Bank Name</span>
                <span className="font-medium text-gray-700">Placeholder Bank</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Account Number</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium text-gray-700">1234567890</span>
                  <button
                    className="text-[#4A148C]/50 hover:text-[#4A148C] transition-colors"
                    aria-label="Copy account number"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Name</span>
                <span className="font-medium text-gray-700">MFM Youth Church</span>
              </div>
            </div>
          </div>

          {/* Online Giving */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-gray-100">
            <div className="w-12 h-12 bg-[#EBF0FA] rounded-xl flex items-center justify-center mb-4">
              <CreditCard className="size-6 text-[#4A148C]" />
            </div>
            <h3 className="text-lg font-bold text-[#4A148C] mb-3">Online Giving</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Give securely online using your debit card or bank account through our trusted
              payment partners.
            </p>
            <Button
              asChild
              className="w-full bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
            >
              <Link href="/giving">
                Give Now
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-gray-100">
            <div className="w-12 h-12 bg-[#FFF3E0] rounded-xl flex items-center justify-center mb-4">
              <QrCode className="size-6 text-[#C62828]" />
            </div>
            <h3 className="text-lg font-bold text-[#4A148C] mb-3">QR Code</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Scan the QR code with your mobile banking app to give directly.
            </p>
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
              <QrCode className="size-16 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}