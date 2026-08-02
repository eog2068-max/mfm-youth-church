"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Flag,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  SmilePlus,
  Reply,
  X,
  Loader2,
  Users,
  MessageCircle,
  AlertTriangle,
  Home,
} from "lucide-react";
import { BackToSocial } from "./back-to-social";
import { SocialFeatureNav } from "./social-feature-nav";

/* ============ TYPES ============ */
interface Channel {
  id: string;
  name: string;
  emoji: string;
  description: string;
  isAnnouncement: boolean;
  messageCount: number;
  lastMessageAt?: string;
}

interface Message {
  id: string;
  channelId: string;
  content: string;
  displayName: string;
  isAnnouncement: boolean;
  replyToId?: string;
  replyToContent?: string;
  replyToDisplayName?: string;
  reactions: Record<string, number>;
  createdAt: string;
}

/* ============ CONSTANTS ============ */
const REACTION_OPTIONS = ["❤️", "🙏", "🙌", "🔥", "👍"];

const REPORT_REASONS = [
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "spam", label: "Spam or advertising" },
  { value: "scam", label: "Scam or fraud attempt" },
  { value: "hate", label: "Hate speech" },
  { value: "false_accusation", label: "False accusation / gossip" },
  { value: "unchristian", label: "Unchristian conduct" },
  { value: "other", label: "Other" },
];

const WARM_GREETINGS = [
  "Welcome to FamilyChat! 🏠",
  "God bless you as you connect with the family today.",
  "The service may end, but the fellowship continues here. ❤️",
];

/* ============ HELPERS ============ */
function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getAvatarColor(name: string): string {
  const colors = [
    "from-[#4A148C] to-[#6A1B9A]",
    "from-[#D32F2F] to-[#E53935]",
    "from-[#2E7D32] to-[#388E3C]",
    "from-[#C62828] to-[#F57C00]",
    "from-[#6A1B9A] to-[#8E24AA]",
    "from-[#00695C] to-[#00897B]",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/* ============ MAIN COMPONENT ============ */
export function FamilyChat() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [reportingMsg, setReportingMsg] = useState<Message | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportExplanation, setReportExplanation] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  // PERMANENT scroll-to-top on mount.
  // Root cause: globals.css `html { scroll-behavior: smooth }` was animating
  // window.scrollTo(0,0) instead of jumping, and the chat container's
  // auto-scroll-to-bottom was interrupting the animation mid-flight.
  // Fix: use behavior:'instant' to bypass the CSS smooth-scroll.
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    const scrollToTop = () => {
      // behavior:'instant' overrides CSS scroll-behavior:smooth
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      } catch {
        window.scrollTo(0, 0);
      }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    // Immediate
    scrollToTop();
    // Deferred — runs after React paints and after any auto-scrolls
    const raf = requestAnimationFrame(scrollToTop);
    const t1 = setTimeout(scrollToTop, 50);
    const t2 = setTimeout(scrollToTop, 200);
    const t3 = setTimeout(scrollToTop, 500);
    const t4 = setTimeout(scrollToTop, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sessionIdRef = useRef(
    typeof window !== "undefined"
      ? sessionStorage.getItem("rs_session") || `user_${Date.now()}`
      : `user_${Date.now()}`
  );

  // Initialize session
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!sessionStorage.getItem("rs_session")) {
        sessionStorage.setItem("rs_session", sessionIdRef.current);
      }
    }
  }, []);

  // Load channels
  useEffect(() => {
    fetch("/api/social/chat/channels")
      .then((r) => r.json())
      .then((d) => {
        setChannels(d.channels || []);
        if (d.channels?.[0]) setActiveChannel(d.channels[0]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load channels");
        setLoading(false);
      });
  }, []);

  // Load messages for a channel
  const loadMessages = useCallback(async (channelId: string) => {
    try {
      const r = await fetch(
        `/api/social/chat/messages?channelId=${channelId}&limit=40`
      );
      const d = await r.json();
      if (d.messages) {
        // Enrich messages with reply content previews
        const enriched = d.messages.map((msg: Message) => {
          if (msg.replyToId) {
            const replyMsg = d.messages.find(
              (m: Message) => m.id === msg.replyToId
            );
            if (replyMsg) {
              return {
                ...msg,
                replyToContent: replyMsg.content,
                replyToDisplayName: replyMsg.displayName,
              };
            }
          }
          return msg;
        });
        setMessages(enriched.reverse()); // newest at bottom
      }
    } catch {
      setMessages([]);
    }
  }, []);

  // Switch channel
  useEffect(() => {
    if (activeChannel) {
      loadMessages(activeChannel.id);
      setReplyingTo(null);
      setShowReactions(null);
      setReportingMsg(null);
      setError("");
    }
  }, [activeChannel, loadMessages]);

  // Poll for new messages (every 6 seconds)
  useEffect(() => {
    if (!activeChannel) return;
    const interval = setInterval(() => {
      loadMessages(activeChannel.id);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeChannel, loadMessages]);

  // Auto-scroll chat container to bottom on new messages
  const isNearBottom = useRef(true);
  useEffect(() => {
    if (isNearBottom.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  // Track scroll position to prevent forced scroll when user reads history
  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    isNearBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  // Send message
  const sendMessage = async () => {
    if (!inputText.trim() || !activeChannel || sending) return;
    if (charCount > MAX_CHARS) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/social/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": sessionIdRef.current,
        },
        body: JSON.stringify({
          channelId: activeChannel.id,
          content: inputText.trim(),
          replyToId: replyingTo?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send message");
        return;
      }
      setInputText("");
      setCharCount(0);
      setReplyingTo(null);
      isNearBottom.current = true;
      loadMessages(activeChannel.id);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  // React to message
  const addReaction = async (messageId: string, reaction: string) => {
    try {
      await fetch(`/api/social/chat/messages/${messageId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction }),
      });
      loadMessages(activeChannel?.id || "");
      setShowReactions(null);
    } catch {
      // Silent
    }
  };

  // Report message
  const submitReport = async () => {
    if (!reportingMsg || !activeChannel || !reportReason) return;
    setReportSubmitting(true);
    try {
      await fetch(`/api/social/chat/messages/${reportingMsg.id}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": sessionIdRef.current,
        },
        body: JSON.stringify({
          channelId: activeChannel.id,
          reason: reportReason,
          explanation: reportExplanation,
        }),
      });
      setReportingMsg(null);
      setReportReason("");
      setReportExplanation("");
    } catch {
      // Silent
    } finally {
      setReportSubmitting(false);
    }
  };

  // Handle input change with character count
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setInputText(val);
      setCharCount(val.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen bg-[#F8FAFF] flex flex-col">
        <BackToSocial />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="size-8 text-[#4A148C] animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading FamilyChat...</p>
          </div>
        </div>
      </div>
    );
  }

  const greeting = WARM_GREETINGS[Math.floor(Date.now() / 86400000) % WARM_GREETINGS.length];

  return (
    <div className="h-screen bg-[#F8FAFF] flex flex-col overflow-hidden">
      <div className="shrink-0 px-4 pt-4 max-w-5xl mx-auto w-full">
        <BackToSocial />
      </div>

      <div className="flex flex-1 min-h-0 max-w-5xl mx-auto w-full px-0 md:px-0 relative">
        {/* ===== CHANNEL SIDEBAR ===== */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute md:relative inset-y-0 left-0 z-20 w-64 md:w-72 bg-white border-r border-gray-100 flex flex-col shrink-0 shadow-sm md:shadow-none"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-[#F8FAFF] to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] flex items-center justify-center">
                      <MessageCircle className="size-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#4A148C]">
                        FamilyChat
                      </h2>
                      <p className="text-[9px] text-gray-400 leading-tight mt-0.5">
                        I Remain Connected To My Church Family
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-1.5 hover:bg-gray-200/80 rounded-lg transition-colors"
                    aria-label="Close chat rooms"
                  >
                    <X className="size-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Channel List */}
              <div className="flex-1 overflow-y-auto py-1">
                {channels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setActiveChannel(ch);
                      if (window.innerWidth < 768) setShowSidebar(false);
                    }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-150 ${
                      activeChannel?.id === ch.id
                        ? "bg-[#4A148C]/5 border-l-[3px] border-[#4A148C]"
                        : "hover:bg-gray-50/80 border-l-[3px] border-transparent"
                    }`}
                  >
                    <span className="text-lg shrink-0">{ch.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[13px] font-medium truncate ${
                          activeChannel?.id === ch.id
                            ? "text-[#4A148C]"
                            : "text-gray-600"
                        }`}
                      >
                        {ch.name}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {ch.isAnnouncement
                          ? `${ch.messageCount} announcements`
                          : `${ch.messageCount} messages`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Community Guidelines */}
              <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Users className="size-3 text-gray-400" />
                  <p className="text-[10px] font-medium text-gray-500">
                    Community Guidelines
                  </p>
                </div>
                <p className="text-[9px] text-gray-400 leading-relaxed">
                  Be kind. Be respectful. Be Christ-like. This is your church
                  family.
                </p>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ===== CHAT AREA ===== */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-100 px-4 pt-6 pb-4 flex items-center justify-between shadow-sm shrink-0">
            {/* Left: "Chat Rooms" label + arrow to open sidebar */}
            <button
              onClick={() => setShowSidebar(true)}
              className="flex flex-col items-center gap-0.5 hover:opacity-80 transition-opacity"
              aria-label="Open chat rooms"
            >
              <span className="text-sm font-bold text-[#4A148C] leading-tight">Chat Rooms</span>
              <ChevronLeft className="size-5 text-[#4A148C] stroke-[2.5]" />
            </button>

            {/* Right: House icon + current channel name */}
            {activeChannel ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F3E5F5] to-[#E8EDFF] flex items-center justify-center">
                  <Home className="size-4 text-[#4A148C]" />
                </div>
                <div className="min-w-0 text-right">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5 justify-end">
                    {activeChannel.name}
                    {activeChannel.isAnnouncement && (
                      <Megaphone className="size-3 text-amber-500" />
                    )}
                  </h3>
                  <p className="text-[10px] text-gray-400 truncate">
                    {activeChannel.description}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Select a channel</p>
            )}
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-4"
          >
            {/* Announcement channel banner */}
            {activeChannel?.isAnnouncement && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Megaphone className="size-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-800">
                    Official Announcements
                  </p>
                  <p className="text-[10px] text-amber-600/80 mt-0.5 leading-relaxed">
                    Updates from church leadership appear here. This channel is
                    read-only for members.
                  </p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {activeChannel && messages.length === 0 && !activeChannel.isAnnouncement && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F3E5F5] to-[#E8EDFF] flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{activeChannel.emoji}</span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {activeChannel.name}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  No messages yet. Start the conversation!
                </p>
                <p className="text-[10px] text-gray-300 italic">{greeting}</p>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-1">
              {messages.map((msg, idx) => {
                const isFirst = idx === 0 || messages[idx - 1]?.displayName !== msg.displayName;
                const showAvatar = isFirst || msg.isAnnouncement;

                return (
                  <div key={msg.id} className="group relative py-0.5">
                    {msg.isAnnouncement ? (
                      /* === ANNOUNCEMENT MESSAGE === */
                      <div className="bg-gradient-to-r from-[#4A148C]/[0.04] to-[#6A1B9A]/[0.04] border border-[#4A148C]/10 rounded-xl p-3.5 my-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-6 h-6 rounded-md bg-[#4A148C]/10 flex items-center justify-center">
                            <Megaphone className="size-3 text-[#4A148C]/70" />
                          </div>
                          <span className="text-[11px] font-bold text-[#4A148C]">
                            {msg.displayName}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-auto">
                            {formatTimeAgo(msg.createdAt)}
                          </span>
                        </div>
                        <p className="text-[13px] text-gray-700 leading-relaxed pl-8">
                          {msg.content}
                        </p>
                        <MessageReactions
                          reactions={msg.reactions}
                          onReact={(r) => addReaction(msg.id, r)}
                          showPicker={showReactions === msg.id}
                          onTogglePicker={() =>
                            setShowReactions(showReactions === msg.id ? null : msg.id)
                          }
                        />
                      </div>
                    ) : (
                      /* === REGULAR MESSAGE === */
                      <div className="flex gap-2.5">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br {getAvatarColor(msg.displayName)} flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-white text-[11px] font-bold">
                            {msg.displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          {/* Name + time (only show on first message in group) */}
                          {showAvatar && (
                            <div className="flex items-baseline gap-2 mb-0.5">
                              <span className="text-[11px] font-semibold text-gray-700">
                                {msg.displayName}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {formatTimeAgo(msg.createdAt)}
                              </span>
                            </div>
                          )}

                          {/* Reply reference */}
                          {msg.replyToId && (
                            <div className="mt-1 bg-[#F3E5F5] border-l-2 border-[#4A148C]/25 rounded-r-lg px-2.5 py-1.5">
                              {msg.replyToDisplayName && (
                                <p className="text-[10px] font-semibold text-[#4A148C]/60">
                                  {msg.replyToDisplayName}
                                </p>
                              )}
                              <p className="text-[10px] text-gray-500 italic truncate max-w-xs">
                                {msg.replyToContent || "Original message"}
                              </p>
                            </div>
                          )}

                          {/* Message bubble */}
                          <div className="mt-0.5 group-hover:bg-gray-50/80 rounded-xl px-0.5 py-0.5 -mx-0.5 transition-colors">
                            <p className="text-[13px] text-gray-700 leading-relaxed break-words pr-16">
                              {msg.content}
                            </p>
                          </div>

                          {/* Reactions */}
                          <MessageReactions
                            reactions={msg.reactions}
                            onReact={(r) => addReaction(msg.id, r)}
                            showPicker={showReactions === msg.id}
                            onTogglePicker={() =>
                              setShowReactions(showReactions === msg.id ? null : msg.id)
                            }
                          />

                          {/* Hover actions */}
                          <div className="flex items-center gap-0.5 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setReplyingTo(msg)}
                              className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-[#4A148C] transition-colors"
                              title="Reply"
                            >
                              <Reply className="size-3" />
                            </button>
                            <button
                              onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                              className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-[#4A148C] transition-colors"
                              title="React"
                            >
                              <SmilePlus className="size-3" />
                            </button>
                            <button
                              onClick={() => setReportingMsg(msg)}
                              className="p-1 hover:bg-red-50 rounded-md text-gray-400 hover:text-red-500 transition-colors"
                              title="Report"
                            >
                              <Flag className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border-t border-red-100 px-4 py-2 flex items-center gap-2 shrink-0"
              >
                <AlertTriangle className="size-3.5 text-red-500 shrink-0" />
                <p className="text-xs text-red-600 flex-1">{error}</p>
                <button
                  onClick={() => setError("")}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="size-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          {activeChannel && (
            <div className="bg-white border-t border-gray-100 p-3 pb-16 shrink-0">
              {/* Replying to indicator */}
              <AnimatePresence>
                {replyingTo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 bg-[#F3E5F5] border border-[#4A148C]/10 rounded-lg px-3 py-2 mb-2">
                      <Reply className="size-3 text-[#4A148C] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold text-[#4A148C]/60">
                          Replying to {replyingTo.displayName}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {replyingTo.content.substring(0, 80)}
                        </p>
                      </div>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="text-gray-400 hover:text-gray-600 shrink-0"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Composer */}
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      activeChannel.isAnnouncement
                        ? "This channel is for announcements only."
                        : `Message ${activeChannel.name}...`
                    }
                    disabled={activeChannel.isAnnouncement}
                    rows={1}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-[#FAFBFF] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/15 focus:border-[#4A148C]/25 transition-all min-h-[42px] max-h-24 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ lineHeight: "1.5" }}
                  />
                  {/* Character counter */}
                  {charCount > 0 && (
                    <span
                      className={`absolute bottom-1.5 right-3 text-[9px] ${
                        charCount > MAX_CHARS * 0.9
                          ? "text-red-400"
                          : "text-gray-300"
                      }`}
                    >
                      {charCount}/{MAX_CHARS}
                    </span>
                  )}
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || sending || activeChannel.isAnnouncement}
                  className="shrink-0 w-10 h-[42px] rounded-xl bg-[#4A148C] hover:bg-[#6A1B9A] text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  {sending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== REPORT MODAL ===== */}
      <AnimatePresence>
        {reportingMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setReportingMsg(null);
              setReportReason("");
              setReportExplanation("");
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Flag className="size-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Report Message
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    Reviewed confidentially by a church moderator
                  </p>
                </div>
              </div>

              {/* Reported message preview */}
              <div className="bg-gray-50 rounded-lg p-2.5 mb-4 border border-gray-100">
                <p className="text-[11px] text-gray-600 italic line-clamp-2">
                  &ldquo;{reportingMsg.content.substring(0, 120)}&rdquo;
                </p>
              </div>

              {/* Reason selection */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  What is the reason?
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {REPORT_REASONS.map((r) => (
                    <label
                      key={r.value}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        reportReason === r.value
                          ? "border-[#4A148C] bg-[#4A148C]/5"
                          : "border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          reportReason === r.value
                            ? "border-[#4A148C]"
                            : "border-gray-300"
                        }`}
                      >
                        {reportReason === r.value && (
                          <div className="w-2 h-2 rounded-full bg-[#4A148C]" />
                        )}
                      </div>
                      <span className="text-xs text-gray-700">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Optional explanation */}
              {reportReason && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-1.5">
                    Additional details (optional)
                  </p>
                  <textarea
                    value={reportExplanation}
                    onChange={(e) => setReportExplanation(e.target.value)}
                    placeholder="Provide any helpful context..."
                    rows={2}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A148C]/15 focus:border-[#4A148C]/25 transition-colors"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setReportingMsg(null);
                    setReportReason("");
                    setReportExplanation("");
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  disabled={!reportReason || reportSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-xs font-medium text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {reportSubmitting ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Flag className="size-3" />
                  )}
                  Submit Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature Navigation Bar */}
      <SocialFeatureNav currentFeatureId="family-chat" />
    </div>
  );
}

/* ============ REACTIONS SUB-COMPONENT ============ */
function MessageReactions({
  reactions,
  onReact,
  showPicker,
  onTogglePicker,
}: {
  reactions: Record<string, number>;
  onReact: (r: string) => void;
  showPicker: boolean;
  onTogglePicker: () => void;
}) {
  const hasReactions = Object.values(reactions).some((c) => c > 0);

  return (
    <div className="flex items-center gap-1 mt-1 flex-wrap">
      {Object.entries(reactions)
        .filter(([, count]) => count > 0)
        .map(([emoji, count]) => (
          <button
            key={emoji}
            onClick={() => onReact(emoji)}
            className="inline-flex items-center gap-0.5 bg-gray-100/80 hover:bg-gray-200 rounded-full px-1.5 py-0.5 text-[11px] transition-colors"
          >
            <span className="text-[10px]">{emoji}</span>
            <span className="text-gray-500 text-[9px]">{count}</span>
          </button>
        ))}

      <button
        onClick={onTogglePicker}
        className={`inline-flex items-center justify-center hover:bg-gray-100 rounded-full p-0.5 transition-colors ${
          showPicker ? "bg-gray-100" : ""
        }`}
        title="Add reaction"
      >
        <SmilePlus
          className={`size-3 transition-colors ${showPicker ? "text-[#4A148C]" : "text-gray-400"}`}
        />
      </button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-md"
          >
            {REACTION_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onReact(emoji)}
                className="hover:scale-125 transition-transform p-0.5 rounded-full hover:bg-gray-50"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
