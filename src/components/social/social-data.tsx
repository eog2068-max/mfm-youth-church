import React from "react";

// ──────────────────────────────────────────────────────────────────
// Permanent chat-bubble SVG icon.
// Do NOT replace with emoji or lucide MessageCircle.
// Emoji rendering is device-dependent and causes visual bugs.
// ──────────────────────────────────────────────────────────────────
export function ChatBubbleIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export interface SocialFeature {
  id: string;
  title: string;
  emoji: React.ReactNode;
  description: string;
  href: string;
  color: string;
  iconBg: string;
  featured: boolean;
  extendedDescription: string;
  ctaText: string;
  landingSteps: { emoji: React.ReactNode; title: string; description: string }[];
}

export const socialFeatures: SocialFeature[] = [
  {
    id: "family-chat",
    title: "FamilyChat",
    emoji: <ChatBubbleIcon />,
    description:
      "Stay connected with your church family through meaningful conversations throughout the week.",
    href: "/social/family-chat",
    color: "from-[#4A148C] to-[#6A1B9A]",
    iconBg: "bg-purple-500",
    featured: true,
    extendedDescription:
      "FamilyChat is your church family\u2019s digital gathering place. Connect through meaningful conversations in dedicated channels \u2014 share prayer requests, discuss Scripture, encourage one another, and stay updated on church life. No account needed. Just come as you are.",
    ctaText: "Enter FamilyChat",
    landingSteps: [
      {
        emoji: "\ud83d\udd0d",
        title: "Discover Channels",
        description:
          "Browse six themed channels \u2014 from General Family to Announcements.",
      },
      {
        emoji: <ChatBubbleIcon className="size-5" />,
        title: "Join the Conversation",
        description:
          "Send messages, reply to others, and react with emojis to build fellowship.",
      },
      {
        emoji: "\ud83d\udd01",
        title: "Stay Connected",
        description:
          "Come back daily. The fellowship doesn\u2019t end after Sunday.",
      },
    ],
  },
  {
    id: "prayer-circle",
    title: "Prayer Circle",
    emoji: "\ud83d\ude4f",
    description:
      "Share prayer requests and stand in faith with one another. Public or private.",
    href: "/social/prayer-circle",
    color: "from-[#D32F2F] to-[#E53935]",
    iconBg: "bg-red-500",
    featured: false,
    extendedDescription:
      "The Prayer Circle is where our church family lifts each other up in prayer. Share your prayer requests \u2014 for healing, family, finances, guidance, or anything on your heart \u2014 and let others stand in agreement with you. Whether public or private, your prayer matters here.",
    ctaText: "Enter Prayer Circle",
    landingSteps: [
      {
        emoji: "\ud83d\ude4f",
        title: "Share Your Request",
        description:
          "Post your prayer need \u2014 healing, family, finances, spiritual growth, or anything else.",
      },
      {
        emoji: "\ud83d\ude4c",
        title: "Others Pray With You",
        description:
          "The family sees your request and stands in agreement. You are never alone in prayer.",
      },
      {
        emoji: "\ud83d\udcaa",
        title: "Watch God Move",
        description:
          "Come back and share your testimony when God answers. Encourage others with your story.",
      },
    ],
  },
  {
    id: "todays-question",
    title: "Today\u2019s Question",
    emoji: "\u2753",
    description:
      "Answer a question that sparks conversation and encouragement across the family.",
    href: "/social/todays-question",
    color: "from-[#2E7D32] to-[#388E3C]",
    iconBg: "bg-green-500",
    featured: false,
    extendedDescription:
      "Every day, a new question is posed to our church family. It could be about faith, life, Scripture, or something lighthearted. Your answer sparks conversation, encouragement, and connection. It\u2019s a simple way to engage and discover what\u2019s on each other\u2019s hearts.",
    ctaText: "Answer Today\u2019s Question",
    landingSteps: [
      {
        emoji: "\ud83d\udcdd",
        title: "See Today\u2019s Question",
        description:
          "A fresh question is posted daily \u2014 thought-provoking, fun, or reflective.",
      },
      {
        emoji: <ChatBubbleIcon className="size-5" />,
        title: "Share Your Answer",
        description:
          "Respond in your own words. There are no wrong answers \u2014 just honest hearts.",
      },
      {
        emoji: "\u2764\ufe0f",
        title: "Connect Through Answers",
        description:
          "Read how others responded. React, encourage, and discover your family.",
      },
    ],
  },
  {
    id: "amen-wall",
    title: "Amen Wall",
    emoji: "\u2764\ufe0f",
    description:
      "Post encouragement, gratitude, testimonies, and faith declarations for the family.",
    href: "/social/amen-wall",
    color: "from-[#C62828] to-[#F57C00]",
    iconBg: "bg-red-500",
    featured: false,
    extendedDescription:
      "The Amen Wall is our digital testimony board. Post your gratitude, encouragement, answered prayers, faith declarations, and praise reports. When you see something that blesses you, respond with a prayer, a love reaction, or a simple \u2018Amen!\u2019 It\u2019s our wall of faith together.",
    ctaText: "Post on the Amen Wall",
    landingSteps: [
      {
        emoji: "\ud83d\udc40",
        title: "Read the Wall",
        description:
          "Browse praise reports, gratitude posts, and faith declarations from the family.",
      },
      {
        emoji: "\ud83c\udf89",
        title: "Post Your Praise",
        description:
          "Share what God has done, what you\u2019re grateful for, or a word of encouragement.",
      },
      {
        emoji: "\ud83d\ude4c",
        title: "Spread Encouragement",
        description:
          "React to others\u2019 posts. A single \u2018Amen\u2019 can strengthen someone\u2019s faith today.",
      },
    ],
  },
  {
    id: "live-together",
    title: "Live Together",
    emoji: "\ud83d\udd34",
    description:
      "Worship together during live services. We may be apart, but we worship as one.",
    href: "/social/live-together",
    color: "from-[#C62828] to-[#D32F2F]",
    iconBg: "bg-red-600",
    featured: false,
    extendedDescription:
      "During live church services, Live Together lets you worship as one family even when you\u2019re apart. React in real-time during worship, prayer, and the sermon. See how many family members are watching alongside you. We may be in different locations, but we worship as one body.",
    ctaText: "Join Live Session",
    landingSteps: [
      {
        emoji: "\ud83d\udd34",
        title: "Join During Service",
        description:
          "When a live service is active, open Live Together to worship alongside the family.",
      },
      {
        emoji: "\ud83d\udd25",
        title: "React in Real-Time",
        description:
          "Tap worship, prayer, love, or fire reactions as the Spirit moves during the service.",
      },
      {
        emoji: "\ud83d\udc65",
        title: "See the Family Together",
        description:
          "Watch the reaction count and viewer numbers rise. You\u2019re not watching alone.",
      },
    ],
  },
];
