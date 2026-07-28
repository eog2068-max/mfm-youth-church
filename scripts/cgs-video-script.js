// CGS Video Ad Scripts — YouTube (60s) + Facebook (30s)
// Scene: Copywriting (no cover, no TOC, single section, line:400, Profile B)
// Palette from copywriting.md

const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, PageNumber, Footer } = require("docx");
const fs = require("fs");

// Copywriting palette
const P = {
  primary: "#1A1A1A",
  body: "#333333",
  secondary: "#666666",
  accent: "#E85D3A",
  surface: "#FFF8F5",
};
const c = (hex) => hex.replace("#", "");

// ── Helper Builders ──

function title(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 100, line: 400 },
    children: [new TextRun({ text, bold: true, size: 36, font: { ascii: "Calibri", eastAsia: "SimHei" }, color: c(P.primary) })],
  });
}

function subtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 300, line: 400 },
    children: [new TextRun({ text, size: 24, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, color: c(P.secondary) })],
  });
}

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 400, after: 200, line: 400 },
    children: [new TextRun({ text, bold: true, size: 28, font: { ascii: "Calibri", eastAsia: "SimHei" }, color: c(P.accent) })],
  });
}

function direction(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 400 },
    children: [new TextRun({ text, size: 21, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, color: "999999", italics: true })],
  });
}

function bodyPara(runs) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 120, after: 120, line: 400 },
    children: runs,
  });
}

function bodyRun(text, opts = {}) {
  return new TextRun({
    text,
    size: 24,
    font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
    color: c(P.body),
    ...opts,
  });
}

function accentRun(text) {
  return new TextRun({
    text,
    size: 24,
    font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
    color: c(P.accent),
    bold: true,
  });
}

function pause(seconds) {
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 400 },
    children: [new TextRun({ text: `[Pause ${seconds} sec]`, size: 21, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, color: "999999", italics: true })],
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" } },
    children: [],
  });
}

function note(text) {
  return new Paragraph({
    spacing: { before: 100, after: 100, line: 400 },
    children: [new TextRun({ text, size: 20, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, color: c(P.secondary) })],
  });
}

// ── YOUTUBE 60s SCRIPT ──

function youtubeScript() {
  return [
    title("CGS Video Ad Script"),
    subtitle("Church Growth Systems \u2014 YouTube & Facebook Campaign"),

    divider(),

    sectionHeading("VERSION A \u2014 YouTube Pre-Roll Ad (60 Seconds)"),
    direction("Target: Senior pastors, church leaders, ministry founders watching Christian content"),
    direction("Tone: Urgent problem-solving opening, warm ministry heart, confident solution reveal"),
    note("Estimated read: ~230 words | Speaking pace: ~230 words/min"),

    // ── HOOK ──
    sectionHeading("HOOK \u2014 The Pain (0:00\u20130:10)"),
    direction("Visual: Slow-motion wide shot of a half-empty church auditorium. Fade to a pastor sitting alone in his office, head in hands."),
    bodyPara([
      bodyRun("Sunday service ends\u2026 and by Monday morning, your members are already disconnected. "),
      bodyRun("No fellowship. No prayer updates. No way to reach the new family that visited last week and never came back."),
    ]),
    pause(2),

    // ── PROBLEM 1: Connection ──
    sectionHeading("PROBLEM 1 \u2014 The Connection Gap (0:10\u20130:20)"),
    direction("Visual: Split screen \u2014 left: scrolling generic social media feed; right: the church\u2019s WhatsApp group, chaotic and buried."),
    bodyPara([
      accentRun("The truth is:"),
      bodyRun(" between Sunday and the next Sunday, your members are on Instagram, Facebook, TikTok\u2026 everywhere except connected to YOUR church. You need a space that\u2019s "),
      accentRun("yours"),
      bodyRun(" \u2014 a custom social community built specifically for your people to fellowship, share testimonies, pray together, and grow\u2026 long after the Amen."),
    ]),
    pause(1),

    // ── PROBLEM 2: Management ──
    sectionHeading("PROBLEM 2 \u2014 The Organization Crisis (0:20\u20130:30)"),
    direction("Visual: Quick montage \u2014 paper attendance sheets, lost visitor cards, a leader searching through piles of folders."),
    bodyPara([
      bodyRun("And then there\u2019s the administrative mountain. Member records scattered. Event planning in chaos. Follow-ups that never happen. Offering tracking that takes hours. Your church deserves better than spreadsheets and clipboards."),
    ]),
    pause(1),

    // ── PROBLEM 3: Evangelism ──
    sectionHeading("PROBLEM 3 \u2014 The Great Commission Gap (0:30\u20130:40)"),
    direction("Visual: A city street at sunset. People walking past a church sign without glancing. Overlay text: \u201CGo therefore and make disciples...\u201D"),
    bodyPara([
      accentRun("Jesus said, \u201CGo ye therefore, and make disciples of ALL nations.\u201D"),
      bodyRun(" But how do you reach beyond your walls when your tools are stuck in the last century? You need a digital platform that helps you fish\u2026 not just sit by the shore."),
    ]),
    pause(1),

    // ── SOLUTION ──
    sectionHeading("THE SOLUTION \u2014 Church Growth Systems (0:40\u20130:52)"),
    direction("Visual: Bright, dynamic montage \u2014 CGS app interface showing live member feed, attendance dashboard, digital outreach tools. Confident pastor reviewing reports on a tablet. Members smiling on their phones."),
    bodyPara([
      accentRun("That\u2019s exactly why we built Church Growth Systems."),
      bodyRun(" CGS gives your church a "),
      accentRun("fully customized mobile app"),
      bodyRun(" with three powerful pillars: a private social community to keep members connected 24/7\u2026 a complete Church Management System to keep your ministry organized and running smoothly\u2026 and a digital evangelism platform to help you Go-A-Fishing and reach souls beyond your building."),
    ]),
    pause(1),

    // ── CTA ──
    sectionHeading("CTA \u2014 Call to Action (0:52\u20131:00)"),
    direction("Visual: Logo animation. Website URL appears. \u201CBook Your Free Demo\u201D button pulses. Warm, confident close-up of pastor smiling."),
    bodyPara([
      bodyRun("Your church was never meant to just survive. It was meant to "),
      accentRun("thrive."),
      bodyRun(" Visit "),
      accentRun("churchgrowthsystems.com"),
      bodyRun(" today to book your FREE demo and see how CGS can transform your ministry."),
      bodyRun(" Your members are waiting. Your community is waiting. The harvest is ready."),
    ]),
    pause(1),
    note("End card with logo, URL, and \u201CBook Free Demo\u201D button remains on screen for 3 seconds."),

    divider(),

    // ── FACEBOOK 30s SCRIPT ──
    sectionHeading("VERSION B \u2014 Facebook / Meta Video Ad (30 Seconds)"),
    direction("Target: Pastors and church leaders scrolling their feed on mobile"),
    direction("Tone: Fast hook, punchy delivery, single clear CTA"),
    note("Estimated read: ~120 words | Optimized for mobile feed with captions"),

    sectionHeading("HOOK (0:00\u20130:05)"),
    direction("Visual: Bold text overlay on dark background: \u201C70% of church visitors never return.\u201D Quick cut to a concerned pastor."),
    bodyPara([
      accentRun("Seventy percent of people who visit your church this Sunday will never come back."),
    ]),
    pause(1),

    sectionHeading("PAIN + SOLUTION (0:05\u20130:20)"),
    direction("Visual: Rapid cuts \u2014 disconnected members, messy admin papers, empty streets. Then flash to CGS app interface: member feed, dashboard, outreach tools."),
    bodyPara([
      bodyRun("Why? Because between services, there\u2019s no connection, no follow-up, no system. That changes today with "),
      accentRun("Church Growth Systems."),
      bodyRun(" We build fully customized church apps with three game-changers: a private social network for your members, a complete management system to keep your church organized, and a digital platform to help you reach the lost and make disciples online."),
    ]),
    pause(1),

    sectionHeading("CTA (0:20\u20130:30)"),
    direction("Visual: Logo + URL + \u201CBook Your Free Demo\u201D button. Warm overlay: church community smiling together."),
    bodyPara([
      bodyRun("Your ministry deserves more than yesterday\u2019s tools. Visit "),
      accentRun("churchgrowthsystems.com"),
      bodyRun(" now and book your "),
      accentRun("FREE demo"),
      bodyRun(" today. The harvest is waiting."),
    ]),
    pause(1),
    note("End card holds for 3 seconds. Ensure captions are on for sound-off viewing."),
  ];
}

// ── Production Notes Section ──
function productionNotes() {
  return [
    divider(),
    sectionHeading("PRODUCTION NOTES"),
    bodyPara([bodyRun("Music: Warm, inspirational instrumental \u2014 starts somber during the pain section, builds to hopeful/energetic at the solution reveal. License a royalty-free track or commission a simple piano-and-strings composition.")]),
    bodyPara([bodyRun("Voice-Over: Male or female, mid-30s to 50s, warm and authoritative tone. Should sound like someone who understands pastoral ministry \u2014 not a commercial announcer. British or neutral African accent preferred for broader appeal across African and global church audiences.")]),
    bodyPara([bodyRun("Captions: Essential for both versions. Use bold, high-contrast captions (white text with dark shadow) on all dialogue. Many viewers watch ads with sound off, especially on Facebook.")]),
    bodyPara([bodyRun("Aspect Ratios: YouTube \u2014 16:9 (1920x1080). Facebook \u2014 shoot 9:16 vertical and crop to 1:1 square for feed flexibility. Both deliverables from a single 16:9 master using safe-zone framing.")]),
    bodyPara([bodyRun("Branding: CGS logo watermark in lower-right corner throughout. Use brand colors consistently in on-screen graphics. End card should match the website\u2019s visual identity.")]),
    bodyPara([bodyRun("Thumbnail (YouTube): Close-up of pastor with warm lighting + bold text overlay: \u201CYour Church App is Missing This\u201D or \u201CStop Losing Members After Sunday.\u201D High contrast, readable at small size.")]),
    bodyPara([bodyRun("CTA Overlays: For YouTube, add clickable end-screen elements linking to the demo booking page. For Facebook, ensure the ad is set up with a website click objective and the destination URL is the demo booking funnel.")]),
  ];
}

// ── Assembly ──

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
          size: 24,
          color: c(P.body),
        },
        paragraph: {
          spacing: { line: 400 },
        },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Church Growth Systems \u2014 Confidential", size: 18, color: c(P.secondary), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
                new TextRun({ text: "   |   Page ", size: 18, color: c(P.secondary), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: c(P.secondary), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
              ],
            }),
          ],
        }),
      },
      children: [
        ...youtubeScript(),
        ...productionNotes(),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("/home/z/my-project/download/CGS_Video_Ad_Script.docx", buf);
  console.log("Document saved: /home/z/my-project/download/CGS_Video_Ad_Script.docx");
});
