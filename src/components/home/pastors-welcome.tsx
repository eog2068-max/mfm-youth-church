import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";
import { SectionWrapper, SectionTitle } from "./section-wrapper";

export function PastorsWelcome() {
  return (
    <SectionWrapper className="bg-[#F3E5F5] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle title="A Word From Our Pastor" />

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Pastor Photo Placeholder */}
          <div className="shrink-0">
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-[#4A148C]/10 to-[#4A148C]/5 border-2 border-[#4A148C]/10 flex flex-col items-center justify-center">
              <Camera className="size-8 text-[#4A148C]/20 mb-1" />
              <span className="text-xs text-[#4A148C]/30 font-medium">Photo Placeholder</span>
            </div>
            <p className="text-center mt-3 font-bold text-[#4A148C] text-sm">Pastor [Name]</p>
            <p className="text-center text-xs text-gray-500">Youth Church Pastor</p>
          </div>

          {/* Welcome Message */}
          <div className="text-center md:text-left flex-1">
            <p className="text-gray-700 leading-relaxed mb-4">
              On behalf of the entire MFM Youth Church family, I warmly welcome you to our
              church home. We are a vibrant, Spirit-filled community of young believers
              committed to worshipping God in spirit and in truth, and to enforcing the
              victory of Calvary in every area of our lives.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Whether you are taking your very first steps in faith or you have been walking
              with God for many years, there is a place for you here. Our desire is that every
              young person who walks through our doors encounters the fire of God, finds
              meaningful fellowship, and discovers their God-given purpose.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We believe that God has brought you here for a reason. MFM Youth Church is a
              place of spiritual intensity, where the Word of God is taught with power,
              prayers are offered with fire, and every believer is equipped to live a
              victorious life. May the Lord bless you abundantly as you connect with us.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-[#D32F2F] font-semibold hover:gap-2.5 transition-all text-sm"
            >
              Read More About Us
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
