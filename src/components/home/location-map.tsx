import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { SectionWrapper, SectionTitle } from "./section-wrapper";

export function LocationMap() {
  return (
    <SectionWrapper className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle title="Find Us" subtitle="We would love to worship with you" />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Map Placeholder */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-lg shadow-black/5 border border-gray-100 min-h-[300px] md:min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.8!2d7.484!3d9.064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sUtako%2C+Abuja!5e0!3m2!1sen!2sng!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "inherit" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MFM Youth Church Location"
              className="w-full h-full"
            />
          </div>

          {/* Contact Info */}
          <div className="md:w-80 lg:w-96 shrink-0 bg-white rounded-2xl p-6 shadow-lg shadow-black/5 border border-gray-100">
            <h3 className="text-lg font-bold text-[#4A148C] mb-6">Contact Information</h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EBF0FA] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="size-4 text-[#4A148C]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Address</p>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                    14 Ekukinam Street, Opp. Chisco Motor Park Utako, Abuja.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EBF0FA] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="size-4 text-[#4A148C]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Phone</p>
                  <a
                    href="tel:+2349050017238"
                    className="text-sm text-[#D32F2F] hover:underline mt-0.5 block"
                  >
                    +234 905 001 7238
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EBF0FA] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="size-4 text-[#4A148C]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Email</p>
                  <a
                    href="mailto:thecenaclemfmycr10@gmail.com"
                    className="text-sm text-[#D32F2F] hover:underline mt-0.5 block"
                  >
                    thecenaclemfmycr10@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="size-4 text-[#2E7D32]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">WhatsApp</p>
                  <a
                    href="https://wa.me/2349050017238"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#2E7D32] hover:underline mt-0.5 block"
                  >
                    +234 905 001 7238
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EBF0FA] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="size-4 text-[#4A148C]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Office Hours</p>
                  <p className="text-sm text-gray-600 mt-0.5">Monday – Friday: 9:00 AM – 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}