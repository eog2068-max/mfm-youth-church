// YouthConnect In-Memory Data Store
// This is a mock data layer that simulates Supabase.
// When Supabase is connected, replace these functions with actual Supabase queries.
// All data resets on server restart (intentional for mock mode).

import {
  SocialQuestion,
  QuestionResponse,
  PublicPrayerRequest,
  PrivatePrayerRequest,
  AmenWallPost,
  WeeklyChallenge,
  LiveSession,
  AttendanceIntention,
  PresenceRecord,
  ModerationLogEntry,
  ChatChannel,
  ChatMessage,
  ChatReport,
} from "./types";

// --- Presence ---
const presenceStore = new Map<string, number>(); // sessionId -> lastSeen timestamp

export function getPresenceCount(): number {
  const now = Date.now();
  const threshold = 5 * 60 * 1000; // 5 minutes
  let count = 0;
  presenceStore.forEach((ts) => {
    if (now - ts < threshold) count++;
  });
  // Add a base count to simulate real activity
  return count + Math.floor(Math.random() * 15) + 20;
}

export function recordPresence(sessionId: string): void {
  presenceStore.set(sessionId, Date.now());
  // Clean up old entries
  const now = Date.now();
  const threshold = 10 * 60 * 1000;
  presenceStore.forEach((ts, key) => {
    if (now - ts > threshold) presenceStore.delete(key);
  });
}

// --- Today's Question ---
const questions: SocialQuestion[] = [
  {
    id: "q1",
    question: "What are you thanking God for today?",
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalResponses: 47,
  },
  {
    id: "q2",
    question: "What are you trusting God for this week?",
    status: "published",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    totalResponses: 32,
  },
];

const questionResponses: QuestionResponse[] = [
  {
    id: "qr1",
    questionId: "q1",
    response: "For life, health, and my family. God has been so faithful!",
    displayName: "Anonymous",
    sessionId: "s1",
    status: "approved",
    reactions: { love: 12, praying: 8, amen: 15, fire: 5 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "qr2",
    questionId: "q1",
    response: "God just opened a new door for me at work. Glory!",
    displayName: "Anonymous",
    sessionId: "s2",
    status: "approved",
    reactions: { love: 9, praying: 5, amen: 11, fire: 8 },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "qr3",
    questionId: "q1",
    response: "My son passed his exams. Thank You, Jesus!",
    displayName: "Anonymous",
    sessionId: "s3",
    status: "approved",
    reactions: { love: 18, praying: 12, amen: 20, fire: 6 },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export function getCurrentQuestion(): SocialQuestion | null {
  return questions.find((q) => q.status === "published") || null;
}

export function getQuestionResponses(questionId: string): QuestionResponse[] {
  return questionResponses.filter(
    (r) => r.questionId === questionId && r.status === "approved"
  );
}

export function addQuestionResponse(
  questionId: string,
  response: string,
  sessionId: string,
  autoApprove: boolean = true
): QuestionResponse {
  const resp: QuestionResponse = {
    id: `qr_${Date.now()}`,
    questionId,
    response: response.substring(0, 200),
    displayName: "Anonymous",
    sessionId,
    status: autoApprove ? "approved" : "pending",
    reactions: { love: 0, praying: 0, amen: 0, fire: 0 },
    createdAt: new Date().toISOString(),
  };
  questionResponses.unshift(resp);
  const q = questions.find((q) => q.id === questionId);
  if (q) q.totalResponses++;
  return resp;
}

export function addReactionToResponse(
  responseId: string,
  type: "love" | "praying" | "amen" | "fire"
): QuestionResponse | null {
  const resp = questionResponses.find((r) => r.id === responseId);
  if (resp) {
    resp.reactions[type]++;
    return resp;
  }
  return null;
}

// --- Prayer Circle ---
const publicPrayers: PublicPrayerRequest[] = [
  {
    id: "pr1",
    request: "Please pray for my mother's health. She is going through surgery next week.",
    displayName: "Anonymous",
    category: "healing",
    sessionId: "s10",
    status: "approved",
    prayerCount: 27,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "pr2",
    request: "Pray for wisdom as I prepare for my final exams this month.",
    displayName: "Anonymous",
    category: "guidance",
    sessionId: "s11",
    status: "approved",
    prayerCount: 15,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "pr3",
    request: "Standing in faith for a financial breakthrough for my family.",
    displayName: "Anonymous",
    category: "finances",
    sessionId: "s12",
    status: "approved",
    prayerCount: 34,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export function getPublicPrayerRequests(): PublicPrayerRequest[] {
  return publicPrayers.filter((p) => p.status === "approved");
}

export function addPublicPrayerRequest(
  request: string,
  category: string,
  sessionId: string,
 autoApprove: boolean = true
): PublicPrayerRequest {
  const prayer: PublicPrayerRequest = {
    id: `pr_${Date.now()}`,
    request: request.substring(0, 500),
    displayName: "Anonymous",
    category,
    sessionId,
    status: autoApprove ? "approved" : "pending",
    prayerCount: 0,
    createdAt: new Date().toISOString(),
  };
  publicPrayers.unshift(prayer);
  return prayer;
}

export function incrementPrayerCount(prayerId: string): PublicPrayerRequest | null {
  const prayer = publicPrayers.find((p) => p.id === prayerId);
  if (prayer) {
    prayer.prayerCount++;
    return prayer;
  }
  return null;
}

// --- Private Prayer Requests (Admin-only access) ---
const privatePrayers: PrivatePrayerRequest[] = [];

export function addPrivatePrayerRequest(
  request: string,
  category: string,
  fullName?: string,
  email?: string,
  phone?: string,
  isUrgent: boolean = false
): PrivatePrayerRequest {
  const prayer: PrivatePrayerRequest = {
    id: `priv_pr_${Date.now()}`,
    request: request.substring(0, 1000),
    fullName: fullName || undefined,
    email: email || undefined,
    phone: phone || undefined,
    category,
    isUrgent,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  privatePrayers.unshift(prayer);
  return prayer;
}

// Admin-only: retrieve all private prayers
export function getPrivatePrayerRequests(): PrivatePrayerRequest[] {
  return [...privatePrayers];
}

// Admin-only: mark as reviewed
export function markPrivatePrayerReviewed(prayerId: string): boolean {
  const prayer = privatePrayers.find((p) => p.id === prayerId);
  if (prayer) {
    prayer.status = "reviewed";
    return true;
  }
  return false;
}

// --- Moderation Queue ---
const moderationQueue: ModerationLogEntry[] = [];

export function getModerationQueue(): ModerationLogEntry[] {
  return [...moderationQueue];
}

export function addToModerationQueue(entry: Omit<ModerationLogEntry, "id" | "createdAt">): ModerationLogEntry {
  const logEntry: ModerationLogEntry = {
    ...entry,
    id: `mod_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  moderationQueue.unshift(logEntry);
  return logEntry;
}

export function approveModerationItem(id: string, targetCollection: "publicPrayers" | "amenPosts" | "questionResponses"): boolean {
  // Find in moderation queue and update status
  const item = moderationQueue.find((m) => m.id === id);
  if (!item) return false;
  item.action = "approved";

  // Find and approve in the target collection
  switch (targetCollection) {
    case "publicPrayers": {
      const prayer = publicPrayers.find((p) => p.id === item.targetId);
      if (prayer) prayer.status = "approved";
      break;
    }
    case "amenPosts": {
      const post = amenPosts.find((p) => p.id === item.targetId);
      if (post) post.status = "approved";
      break;
    }
    case "questionResponses": {
      const resp = questionResponses.find((r) => r.id === item.targetId);
      if (resp) resp.status = "approved";
      break;
    }
  }
  return true;
}

export function hideModerationItem(id: string, targetCollection: "publicPrayers" | "amenPosts" | "questionResponses"): boolean {
  const item = moderationQueue.find((m) => m.id === id);
  if (!item) return false;
  item.action = "hidden";

  switch (targetCollection) {
    case "publicPrayers": {
      const prayer = publicPrayers.find((p) => p.id === item.targetId);
      if (prayer) prayer.status = "hidden";
      break;
    }
    case "amenPosts": {
      const post = amenPosts.find((p) => p.id === item.targetId);
      if (post) post.status = "hidden";
      break;
    }
    case "questionResponses": {
      const resp = questionResponses.find((r) => r.id === item.targetId);
      if (resp) resp.status = "hidden";
      break;
    }
  }
  return true;
}

// --- Amen Wall ---
const amenPosts: AmenWallPost[] = [
  {
    id: "aw1",
    message: "God has been faithful to my family. Thank You, Lord!",
    displayName: "Anonymous",
    sessionId: "s20",
    status: "approved",
    reactions: { praying: 8, love: 12, amen: 15, fire: 3 },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "aw2",
    message: "Thank You, Jesus! My testimony is coming soon.",
    displayName: "Anonymous",
    sessionId: "s21",
    status: "approved",
    reactions: { praying: 5, love: 9, amen: 18, fire: 7 },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "aw3",
    message: "Praying for everyone going through a difficult season. God is with you!",
    displayName: "Anonymous",
    sessionId: "s22",
    status: "approved",
    reactions: { praying: 20, love: 14, amen: 10, fire: 4 },
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
];

export function getAmenWallPosts(): AmenWallPost[] {
  return amenPosts.filter((p) => p.status === "approved");
}

export function addAmenWallPost(
  message: string,
  sessionId: string,
  autoApprove: boolean = true
): AmenWallPost {
  const post: AmenWallPost = {
    id: `aw_${Date.now()}`,
    message: message.substring(0, 200),
    displayName: "Anonymous",
    sessionId,
    status: autoApprove ? "approved" : "pending",
    reactions: { praying: 0, love: 0, amen: 0, fire: 0 },
    createdAt: new Date().toISOString(),
  };
  amenPosts.unshift(post);
  return post;
}

export function addReactionToAmenPost(
  postId: string,
  type: "praying" | "love" | "amen" | "fire"
): AmenWallPost | null {
  const post = amenPosts.find((p) => p.id === postId);
  if (post) {
    post.reactions[type]++;
    return post;
  }
  return null;
}

// --- Weekly Challenge ---
const challenges: WeeklyChallenge[] = [
  {
    id: "ch1",
    title: "Encourage one person who needs hope",
    description:
      "This week, reach out to at least one person who is going through a tough time. Send them a message of encouragement, share a scripture, or simply let them know you are praying for them. A small act of kindness can change someone's entire week.",
    status: "published",
    scheduledDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    participationCount: 126,
    createdAt: new Date().toISOString(),
  },
];

const challengeParticipations = new Set<string>();

export function getCurrentChallenge(): WeeklyChallenge | null {
  const now = new Date();
  return (
    challenges.find(
      (c) =>
        c.status === "published" &&
        new Date(c.scheduledDate) <= now &&
        new Date(c.endDate) >= now
    ) || null
  );
}

export function joinChallenge(
  challengeId: string,
  sessionId: string
): { joined: boolean; total: number } {
  const key = `${challengeId}:${sessionId}`;
  if (challengeParticipations.has(key)) {
    return { joined: false, total: challenges[0]?.participationCount || 0 };
  }
  challengeParticipations.add(key);
  const challenge = challenges.find((c) => c.id === challengeId);
  if (challenge) challenge.participationCount++;
  return { joined: true, total: challenge?.participationCount || 0 };
}

// --- Live Together ---
const liveSession: LiveSession = {
  id: "ls1",
  title: "Sunday Worship Service",
  status: "scheduled",
  youtubeUrl: "https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID",
  viewerCount: 0,
};

export function getLiveSession(): LiveSession {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour * 60 + minute;

  // Sunday 7:00 AM - 10:00 AM
  if (day === 0 && time >= 420 && time <= 600) {
    liveSession.status = "live";
    liveSession.title = "Sunday Worship Service";
    liveSession.viewerCount = Math.floor(Math.random() * 200) + 150;
  }
  // Tuesday 5:30 PM - 7:00 PM
  else if (day === 2 && time >= 1050 && time <= 1140) {
    liveSession.status = "live";
    liveSession.title = "Tuesday Digging Deep";
    liveSession.viewerCount = Math.floor(Math.random() * 100) + 50;
  }
  // Thursday 5:30 PM - 7:00 PM
  else if (day === 4 && time >= 1050 && time <= 1140) {
    liveSession.status = "live";
    liveSession.title = "Thursday Faith Clinic";
    liveSession.viewerCount = Math.floor(Math.random() * 100) + 50;
  } else {
    liveSession.status = "scheduled";
    liveSession.viewerCount = 0;
  }

  return { ...liveSession };
}

const liveReactionCounts = { worship: 0, prayer: 0, love: 0, fire: 0 };

export function addLiveReaction(
  type: "worship" | "prayer" | "love" | "fire"
): Record<string, number> {
  liveReactionCounts[type]++;
  return { ...liveReactionCounts };
}

export function getLiveReactionCounts(): Record<string, number> {
  return { ...liveReactionCounts };
}

// --- Who's Coming? ---
const attendanceIntentions: AttendanceIntention[] = [];

export function addAttendanceIntention(
  eventId: string,
  sessionId: string,
  type: "self" | "family" | "friend"
): { counts: { self: number; family: number; friend: number; total: number } } {
  const key = `${eventId}:${sessionId}`;
  const existing = attendanceIntentions.find((a) => a.sessionId === sessionId && a.eventId === eventId);
  if (existing) {
    existing.type = type;
  } else {
    attendanceIntentions.push({
      id: `att_${Date.now()}`,
      eventId,
      sessionId,
      type,
      createdAt: new Date().toISOString(),
    });
  }
  return getAttendanceCounts(eventId);
}

export function getAttendanceCounts(eventId: string): {
  self: number;
  family: number;
  friend: number;
  total: number;
} {
  const eventIntentions = attendanceIntentions.filter((a) => a.eventId === eventId);
  const self = eventIntentions.filter((a) => a.type === "self").length;
  const family = eventIntentions.filter((a) => a.type === "family").length;
  const friend = eventIntentions.filter((a) => a.type === "friend").length;
  return { self, family, friend, total: self + family + friend };
}

// Seed some mock attendance data
addAttendanceIntention("ev1", "mock_s1", "self");
addAttendanceIntention("ev1", "mock_s2", "self");
addAttendanceIntention("ev1", "mock_s3", "family");
addAttendanceIntention("ev1", "mock_s4", "self");
addAttendanceIntention("ev1", "mock_s5", "friend");

// ============================================================
// FamilyChat Store
// ============================================================

const chatChannels: ChatChannel[] = [
  {
    id: "ch_general",
    name: "General Family",
    emoji: "🏠",
    description: "Everyday church-family conversation.",
    order: 0,
    isAnnouncement: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessageAt: new Date(Date.now() - 60000).toISOString(),
    messageCount: 42,
  },
  {
    id: "ch_prayer",
    name: "Prayer & Encouragement",
    emoji: "🙏",
    description: "Prayer and spiritual support.",
    order: 1,
    isAnnouncement: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessageAt: new Date(Date.now() - 300000).toISOString(),
    messageCount: 28,
  },
  {
    id: "ch_bible",
    name: "Bible & Faith",
    emoji: "📖",
    description: "Healthy Bible discussions.",
    order: 2,
    isAnnouncement: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessageAt: new Date(Date.now() - 900000).toISOString(),
    messageCount: 15,
  },
  {
    id: "ch_family",
    name: "Family & Marriage",
    emoji: "👨‍👩‍👧",
    description: "Christian family and relationship discussions.",
    order: 3,
    isAnnouncement: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessageAt: new Date(Date.now() - 1800000).toISOString(),
    messageCount: 8,
  },
  {
    id: "ch_church_life",
    name: "Church Life & Activities",
    emoji: "🎉",
    description: "Church activities and community matters.",
    order: 4,
    isAnnouncement: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    messageCount: 12,
  },
  {
    id: "ch_announcements",
    name: "Church Announcements",
    emoji: "📢",
    description: "Admin-only publishing.",
    order: 5,
    isAnnouncement: true,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
    messageCount: 3,
  },
];

const chatMessages: ChatMessage[] = [
  {
    id: "msg_1",
    channelId: "ch_general",
    content: "Good morning, family! Hope everyone had a blessed week. God is faithful!",
    displayName: "Anonymous",
    sessionId: "s100",
    status: "approved",
    isAnnouncement: false,
    reactions: { "❤️": 8, "🙏": 5, "🙌": 3 },
    reportCount: 0,
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "msg_2",
    channelId: "ch_general",
    content: "Praise God! He's been so good to my family this week. My daughter got admitted to university!",
    displayName: "Anonymous",
    sessionId: "s101",
    status: "approved",
    isAnnouncement: false,
    replyToId: "msg_1",
    reactions: { "🙏": 12, "🔥": 7, "❤️": 9 },
    reportCount: 0,
    createdAt: new Date(Date.now() - 540000).toISOString(),
  },
  {
    id: "msg_3",
    channelId: "ch_general",
    content: "Congratulations! That's wonderful news. God will continue to guide her path. Amen!",
    displayName: "Anonymous",
    sessionId: "s102",
    status: "approved",
    isAnnouncement: false,
    replyToId: "msg_2",
    reactions: { "❤️": 4, "🙌": 6 },
    reportCount: 0,
    createdAt: new Date(Date.now() - 480000).toISOString(),
  },
  {
    id: "msg_4",
    channelId: "ch_general",
    content: "Does anyone know if there's a Bible study this Tuesday? I want to come prepared.",
    displayName: "Anonymous",
    sessionId: "s103",
    status: "approved",
    isAnnouncement: false,
    reactions: {},
    reportCount: 0,
    createdAt: new Date(Date.now() - 360000).toISOString(),
  },
  {
    id: "msg_5",
    channelId: "ch_general",
    content: "Yes! Tuesday Digging Deep at 5:30 PM. We're studying the book of Romans. Come join us!",
    displayName: "Anonymous",
    sessionId: "s104",
    status: "approved",
    isAnnouncement: false,
    replyToId: "msg_4",
    reactions: { "🙏": 3, "❤️": 2 },
    reportCount: 0,
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "msg_6",
    channelId: "ch_prayer",
    content: "Please keep my family in your prayers. My father is going for a medical procedure next week. We trust God for a successful outcome.",
    displayName: "Anonymous",
    sessionId: "s105",
    status: "approved",
    isAnnouncement: false,
    reactions: { "🙏": 18, "❤️": 12 },
    reportCount: 0,
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "msg_7",
    channelId: "ch_prayer",
    content: "We are praying with you, dear. God is the Great Physician. He will see your father through. Be encouraged!",
    displayName: "Anonymous",
    sessionId: "s106",
    status: "approved",
    isAnnouncement: false,
    replyToId: "msg_6",
    reactions: { "🙏": 7, "❤️": 5 },
    reportCount: 0,
    createdAt: new Date(Date.now() - 1080000).toISOString(),
  },
  {
    id: "msg_8",
    channelId: "ch_bible",
    content: "\"Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.\" - Proverbs 3:5-6",
    displayName: "Anonymous",
    sessionId: "s107",
    status: "approved",
    isAnnouncement: false,
    reactions: { "❤️": 15, "🙏": 11, "🔥": 8, "🙌": 6 },
    reportCount: 0,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "msg_announce_1",
    channelId: "ch_announcements",
    content: "Sunday Worship Service this week starts at 7:00 AM. Theme: \"Grace That Transform.\" Please come early. God bless you all!",
    displayName: "Church Admin",
    sessionId: "admin_1",
    status: "approved",
    isAnnouncement: true,
    reactions: { "❤️": 22, "🙏": 14 },
    reportCount: 0,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

const chatReports: ChatReport[] = [];
const blockedSessions = new Set<string>();

// --- FamilyChat Functions ---

export function getChatChannels(): ChatChannel[] {
  return chatChannels
    .filter((ch) => ch.status === "active")
    .sort((a, b) => a.order - b.order);
}

export function getChatChannelById(channelId: string): ChatChannel | null {
  return chatChannels.find((ch) => ch.id === channelId && ch.status === "active") || null;
}

export function getChatMessages(
  channelId: string,
  limit: number = 50,
  before?: string
): ChatMessage[] {
  let messages = chatMessages.filter(
    (m) => m.channelId === channelId && m.status === "approved"
  );
  if (before) {
    const beforeDate = new Date(before).getTime();
    messages = messages.filter((m) => new Date(m.createdAt).getTime() < beforeDate);
  }
  return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
}

export function addChatMessage(
  channelId: string,
  content: string,
  sessionId: string,
  displayName: string = "Anonymous",
  replyToId?: string
): ChatMessage {
  const channel = chatChannels.find((ch) => ch.id === channelId);
  const isAnnouncement = channel?.isAnnouncement || false;

  const msg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    channelId,
    content: content.substring(0, 500),
    displayName,
    sessionId,
    status: "approved",
    isAnnouncement,
    replyToId,
    reactions: {},
    reportCount: 0,
    createdAt: new Date().toISOString(),
  };
  chatMessages.push(msg);

  // Update channel stats
  if (channel) {
    channel.lastMessageAt = msg.createdAt;
    channel.messageCount++;
    channel.updatedAt = msg.createdAt;
  }

  return msg;
}

export function addReactionToChatMessage(
  messageId: string,
  reaction: string
): ChatMessage | null {
  const msg = chatMessages.find((m) => m.id === messageId);
  if (msg) {
    msg.reactions[reaction] = (msg.reactions[reaction] || 0) + 1;
    return msg;
  }
  return null;
}

export function reportChatMessage(
  messageId: string,
  channelId: string,
  sessionId: string,
  reason: string
): ChatReport {
  const report: ChatReport = {
    id: `rpt_${Date.now()}`,
    messageId,
    channelId,
    sessionId,
    reason,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  chatReports.push(report);

  // Increment report count on message
  const msg = chatMessages.find((m) => m.id === messageId);
  if (msg) msg.reportCount++;

  // Auto-hide if 3+ reports
  if (msg && msg.reportCount >= 3) {
    msg.status = "hidden";
  }

  return report;
}

export function getChatReports(): ChatReport[] {
  return [...chatReports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Admin functions for FamilyChat
export function removeChatMessage(messageId: string): boolean {
  const idx = chatMessages.findIndex((m) => m.id === messageId);
  if (idx !== -1) {
    chatMessages[idx].status = "hidden";
    return true;
  }
  return false;
}

export function pinChatMessage(messageId: string): boolean {
  const msg = chatMessages.find((m) => m.id === messageId);
  if (msg) {
    msg.status = "pinned";
    msg.pinnedAt = new Date().toISOString();
    return true;
  }
  return false;
}

export function unpinChatMessage(messageId: string): boolean {
  const msg = chatMessages.find((m) => m.id === messageId);
  if (msg && msg.status === "pinned") {
    msg.status = "approved";
    msg.pinnedAt = undefined;
    return true;
  }
  return false;
}

export function blockUser(sessionId: string): boolean {
  blockedSessions.add(sessionId);
  return true;
}

export function unblockUser(sessionId: string): boolean {
  blockedSessions.delete(sessionId);
  return true;
}

export function isUserBlocked(sessionId: string): boolean {
  return blockedSessions.has(sessionId);
}

// --- Update Admin Overview Stats to include FamilyChat ---
export function getSocialOverviewStats() {
  const activeChannels = chatChannels.filter((ch) => ch.status === "active");
  const totalMessages = chatMessages.filter((m) => m.status === "approved").length;
  const pendingReports = chatReports.filter((r) => r.status === "pending").length;

  return {
    presenceCount: getPresenceCount(),
    currentQuestion: getCurrentQuestion(),
    totalPublicPrayers: publicPrayers.filter((p) => p.status === "approved").length,
    totalPrivatePrayers: privatePrayers.length,
    pendingPrivatePrayers: privatePrayers.filter((p) => p.status === "new").length,
    totalAmenPosts: amenPosts.filter((p) => p.status === "approved").length,
    totalQuestionResponses: questionResponses.filter((r) => r.status === "approved").length,
    totalChatChannels: activeChannels.length,
    totalChatMessages: totalMessages,
    pendingChatReports: pendingReports,
    currentChallenge: getCurrentChallenge(),
    liveSession: getLiveSession(),
    moderationQueueSize: moderationQueue.filter((m) => m.action === "pending").length,
    totalAttendanceIntentions: attendanceIntentions.length,
  };
}
