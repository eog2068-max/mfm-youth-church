// YouthConnect Database Types
// These types define the data structure for all social features
// When Supabase is connected, these will map to actual database tables

export interface SocialQuestion {
  id: string;
  question: string;
  status: "published" | "draft" | "archived";
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
  totalResponses: number;
}

export interface QuestionResponse {
  id: string;
  questionId: string;
  response: string;
  displayName: string;
  sessionId: string;
  status: "approved" | "pending" | "hidden";
  reactions: { love: number; praying: number; amen: number; fire: number };
  createdAt: string;
}

export interface PublicPrayerRequest {
  id: string;
  request: string;
  displayName: string;
  category: string;
  sessionId: string;
  status: "approved" | "pending" | "hidden";
  prayerCount: number;
  createdAt: string;
}

export interface PrivatePrayerRequest {
  id: string;
  request: string;
  fullName?: string;
  email?: string;
  phone?: string;
  category: string;
  isUrgent: boolean;
  status: "new" | "reviewed" | "archived";
  createdAt: string;
}

export interface AmenWallPost {
  id: string;
  message: string;
  displayName: string;
  sessionId: string;
  status: "approved" | "pending" | "hidden";
  reactions: { praying: number; love: number; amen: number; fire: number };
  createdAt: string;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  status: "published" | "draft" | "archived";
  scheduledDate: string;
  endDate: string;
  participationCount: number;
  createdAt: string;
}

export interface ChallengeParticipation {
  id: string;
  challengeId: string;
  sessionId: string;
  type: "self" | "family" | "friend";
  createdAt: string;
}

export interface LiveSession {
  id: string;
  title: string;
  status: "live" | "ended" | "scheduled";
  youtubeUrl?: string;
  currentPrompt?: string;
  viewerCount: number;
  startedAt?: string;
  endedAt?: string;
}

export interface LiveReaction {
  id: string;
  sessionId: string;
  type: "worship" | "prayer" | "love" | "fire";
  createdAt: string;
}

export interface AttendanceIntention {
  id: string;
  eventId: string;
  sessionId: string;
  type: "self" | "family" | "friend";
  createdAt: string;
}

export interface PresenceRecord {
  sessionId: string;
  lastSeen: string;
}

export interface ReactionPayload {
  type: "love" | "praying" | "amen" | "fire";
}

// --- FamilyChat Types ---
export interface ChatChannel {
  id: string;
  name: string;
  emoji: string;
  description: string;
  order: number;
  isAnnouncement: boolean;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  messageCount: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  content: string;
  displayName: string;
  sessionId: string;
  status: "approved" | "pending" | "hidden" | "pinned";
  isAnnouncement: boolean;
  replyToId?: string;
  reactions: Record<string, number>;
  reportCount: number;
  createdAt: string;
  pinnedAt?: string;
}

export interface ChatReport {
  id: string;
  messageId: string;
  channelId: string;
  sessionId: string;
  reason: string;
  status: "pending" | "reviewed" | "dismissed";
  createdAt: string;
  reviewedAt?: string;
  actionTaken?: string;
}

export interface ModerationLogEntry {
  id: string;
  targetType: "publicPrayer" | "amenPost" | "questionResponse";
  targetId: string;
  content: string;
  sessionId: string;
  action: "pending" | "approved" | "hidden" | "deleted";
  moderatedBy?: string;
  createdAt: string;
}
