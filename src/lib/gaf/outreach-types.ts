/**
 * Shared outreach constants for Go-A-Fishing.
 *
 * Used by both member and admin outreach endpoints.
 *
 * Stage 9 of Go-A-Fishing.
 */

export const VALID_TYPES = [
  "door_to_door",
  "street_preaching",
  "hospital_visit",
  "prison_ministry",
  "school_outreach",
  "market_evangelism",
  "phone_call",
  "social_media",
  "personal_visit",
  "other",
] as const;

export type OutreachType = (typeof VALID_TYPES)[number];

export const TYPE_LABELS: Record<string, string> = {
  door_to_door: "Door-to-Door",
  street_preaching: "Street Preaching",
  hospital_visit: "Hospital Visit",
  prison_ministry: "Prison Ministry",
  school_outreach: "School Outreach",
  market_evangelism: "Market Evangelism",
  phone_call: "Phone Call",
  social_media: "Social Media",
  personal_visit: "Personal Visit",
  other: "Other",
};

export const TYPE_COLORS: Record<string, string> = {
  door_to_door: "bg-purple-100 text-purple-700",
  street_preaching: "bg-amber-100 text-amber-700",
  hospital_visit: "bg-rose-100 text-rose-700",
  prison_ministry: "bg-purple-100 text-purple-700",
  school_outreach: "bg-teal-100 text-teal-700",
  market_evangelism: "bg-red-100 text-red-700",
  phone_call: "bg-green-100 text-green-700",
  social_media: "bg-purple-100 text-purple-700",
  personal_visit: "bg-cyan-100 text-cyan-700",
  other: "bg-gray-100 text-gray-600",
};
