import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
  Radio,
} from "lucide-react";

const pillarLinks = [
  {
    title: "CONNECT",
    subtitle: "YouthConnect",
    color: "text-[#C62828]",
    links: [
      { label: "FamilyChat", href: "/social/family-chat" },
      { label: "Prayer Circle", href: "/social/prayer-circle" },
      { label: "Today's Question", href: "/social/todays-question" },
      { label: "Amen Wall", href: "/social/amen-wall" },
    ],
  },
  {
    title: "ORGANIZE",
    subtitle: "Church Management System",
    color: "text-[#4A148C]",
    links: [
      { label: "Announcements", href: "/announcements" },
      { label: "Events", href: "/events" },
      { label: "Devotionals", href: "/devotionals" },
      { label: "Sermons", href: "/sermons" },
    ],
  },
  {
    title: "REACH",
    subtitle: "Go-A-Fishing",
    color: "text-[#7B1FA2]",
    links: [
      { label: "Dashboard", href: "/go-a-fishing/dashboard" },
      { label: "Leaderboard", href: "/go-a-fishing/leaderboard" },
      { label: "Awards", href: "/go-a-fishing/awards" },
    ],
  },
];

const generalLinks = [
  { label: "About Us", href: "/about" },
  { label: "Leadership", href: "/leadership" },
  { label: "Testimonies", href: "/testimonies" },
  { label: "Prayer", href: "/prayer" },
  { label: "Giving", href: "/giving" },
  { label: "Contact", href: "/contact" },
  { label: "Photo Gallery", href: "/gallery" },
  { label: "Departments", href: "/departments" },
  { label: "Members", href: "/members" },
  { label: "Join Ministry", href: "/join-ministry" },
];

export function Footer() {
  return (
    <footer className="bg-[#1A0033] text-white">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 space-y-8 lg:space-y-0">
          {/* Column 1 — About */}
          <div>
            <h3 className="text-lg font-bold leading-tight">Mountain of Fire and Miracles Ministries</h3>
            <p className="text-sm text-purple-200/70 mt-0.5">(Youth Church)</p>
            <p className="text-sm text-purple-200/60 mt-4 leading-relaxed">
              A place of destiny fulfillment, where lives are transformed by the power of God&apos;s Word and the fellowship of the Holy Spirit.
            </p>
            <div className="flex items-start gap-2 mt-4 text-sm text-purple-200/60">
              <MapPin className="size-4 shrink-0 mt-0.5" />
              <span>14 Ekukinam Street, Opp. Chisco Motor Park Utako, Abuja.</span>
            </div>
          </div>

          {/* Column 2 — Our Platforms (Three Pillars) */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-200/50 mb-4">
              Our Platforms
            </h4>
            {/* Pillars side-by-side on sm+, stacked on mobile */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {pillarLinks.map((pillar) => (
                <div key={pillar.title} className="sm:col-span-1">
                  <h5 className={`text-xs font-bold ${pillar.color} tracking-wide`}>
                    {pillar.title}
                  </h5>
                  <p className="text-[10px] text-purple-200/40 mb-2">{pillar.subtitle}</p>
                  <ul className="space-y-1.5">
                    {pillar.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-xs text-purple-100/70 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 — Quick Links (General) */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-200/50 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {generalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-purple-100/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Service Times */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-200/50 mb-4">
              Service Times
            </h4>
            <div className="text-sm">
              {/* Row 1: Sunday + Tuesday side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-semibold text-white">Sundays</p>
                  <div className="flex items-center gap-2 text-purple-100/70 mt-1">
                    <Clock className="size-3.5" />
                    <span>Service: 7:00 AM</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-white">Tuesdays</p>
                  <div className="flex items-center gap-2 text-purple-100/70 mt-1">
                    <Clock className="size-3.5" />
                    <span>Digging Deep: 5:30 PM</span>
                  </div>
                </div>
              </div>
              {/* Row 2: Thursday centered alone */}
              <div className="mt-3 text-center">
                <p className="font-semibold text-white">Thursdays</p>
                <div className="flex items-center justify-center gap-2 text-purple-100/70 mt-1">
                  <Clock className="size-3.5" />
                  <span>Faith Clinic: 5:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 5 — Connect With Us */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-200/50 mb-4">
              Connect With Us
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+2349050017238"
                className="flex items-center gap-2 text-purple-100/70 hover:text-white transition-colors"
              >
                <Phone className="size-4" />
                <span>+234 905 001 7238</span>
              </a>
              <a
                href="mailto:thecenaclemfmycr10@gmail.com"
                className="flex items-center gap-2 text-purple-100/70 hover:text-white transition-colors"
              >
                <Mail className="size-4" />
                <span>thecenaclemfmycr10@gmail.com</span>
              </a>
              <a
                href="https://wa.me/2349050017238"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-100/70 hover:text-white transition-colors"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://facebook.com/mfmannexyouth"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="https://instagram.com/mfmannexyouth"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://x.com/mfmannexyouth"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="https://youtube.com/@mfmannexyouth"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Youtube className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Watch Live CTA Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 lg:my-4">
        <a
          href="/live"
          className="flex items-center justify-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl py-3 font-semibold transition-colors w-full max-w-md mx-auto"
        >
          <Radio className="size-4" />
          Watch Live Service
        </a>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-center text-xs sm:text-sm text-purple-200/50">
            &copy; 2026 Mountain of Fire and Miracles Ministries, Youth Church. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
