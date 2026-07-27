/**
 * Scoring engine for Go-A-Fishing referral events.
 *
 * Each ReferralEvent has a `status` (invited | attended | saved | baptized |
 * member | lost_contact). Each status carries a point weight. A member's
 * total score for a reward cycle = sum of weights of their referrals whose
 * status advanced during the cycle window.
 *
 * Weights are configurable via AdminConfig.scoringWeights (JSON string).
 * Defaults match the original Stage 2 design.
 *
 * Stage 3 of Go-A-Fishing.
 */

import type { Prisma } from "@prisma/client";

/** All possible ReferralEvent.status values. */
export const REFERRAL_STATUSES = [
  "invited",
  "attended",
  "saved",
  "baptized",
  "member",
  "lost_contact",
] as const;

export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];

/** Default weights per Stage 2 design. */
export const DEFAULT_SCORING_WEIGHTS: Record<ReferralStatus, number> = {
  invited: 1,
  attended: 5,
  saved: 10,
  baptized: 25,
  member: 50,
  lost_contact: 0, // historical pts retained, no forward pts
};

/**
 * Ordered progression of statuses. Higher index = further along the funnel.
 * Used for validation — status can only advance forward (or jump to lost_contact).
 */
export const STATUS_PROGRESSION: ReferralStatus[] = [
  "invited",
  "attended",
  "saved",
  "baptized",
  "member",
];

/**
 * Parses a scoring weights JSON string from AdminConfig.
 * Falls back to defaults on parse failure or missing keys.
 */
export function parseScoringWeights(
  json: string | null | undefined
): Record<ReferralStatus, number> {
  if (!json) return { ...DEFAULT_SCORING_WEIGHTS };
  try {
    const parsed = JSON.parse(json) as Partial<Record<ReferralStatus, number>>;
    return {
      ...DEFAULT_SCORING_WEIGHTS,
      ...parsed,
    } as Record<ReferralStatus, number>;
  } catch {
    return { ...DEFAULT_SCORING_WEIGHTS };
  }
}

/**
 * Serializes scoring weights to JSON string for storage in AdminConfig.
 */
export function serializeScoringWeights(
  weights: Record<ReferralStatus, number>
): string {
  return JSON.stringify(weights);
}

/**
 * Returns the point value for a single referral status.
 */
export function scoreForStatus(
  status: string,
  weights: Record<ReferralStatus, number> = DEFAULT_SCORING_WEIGHTS
): number {
  if (!isReferralStatus(status)) return 0;
  return weights[status] ?? 0;
}

/**
 * Computes the total score and per-status breakdown for a list of referrals.
 *
 * @param referrals - Array of ReferralEvent records (or partial shapes).
 * @param weights   - Optional weight override (from AdminConfig).
 *
 * @example
 *   const { total, breakdown } = computeMemberScore(member.referralsMade);
 *   // → { total: 47, breakdown: { invited: 3, attended: 15, saved: 10, baptized: 0, member: 50, lost_contact: 0 } }
 *   // Note: breakdown values are SUMS, not counts.
 */
export function computeMemberScore(
  referrals: Array<{ status: string }>,
  weights: Record<ReferralStatus, number> = DEFAULT_SCORING_WEIGHTS
): {
  total: number;
  breakdown: Record<ReferralStatus, number>;
  counts: Record<ReferralStatus, number>;
} {
  const breakdown: Record<ReferralStatus, number> = {
    invited: 0,
    attended: 0,
    saved: 0,
    baptized: 0,
    member: 0,
    lost_contact: 0,
  };
  const counts: Record<ReferralStatus, number> = { ...breakdown };

  for (const ref of referrals) {
    if (!isReferralStatus(ref.status)) continue;
    const status = ref.status as ReferralStatus;
    breakdown[status] += weights[status] ?? 0;
    counts[status] += 1;
  }

  const total = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  return { total, breakdown, counts };
}

/**
 * Validates that a status transition is legal (forward progress only).
 *
 * Rules:
 * - Same-status "transition" is allowed (idempotent re-marking).
 * - Forward progress is allowed (e.g. invited → attended).
 * - Backward progress is FORBIDDEN (e.g. attended → invited).
 * - Transition to "lost_contact" is allowed from any non-terminal status.
 * - Transition OUT of "lost_contact" requires admin reset (returns false here;
 *   admin must first reset to a valid status).
 *
 * @returns `{ valid: true }` or `{ valid: false, reason: string }`
 */
export function validateStatusTransition(
  from: string,
  to: string
): { valid: true } | { valid: false; reason: string } {
  if (!isReferralStatus(to)) {
    return { valid: false, reason: `Unknown target status: "${to}"` };
  }
  if (!isReferralStatus(from)) {
    return { valid: false, reason: `Unknown source status: "${from}"` };
  }

  const fromStatus = from as ReferralStatus;
  const toStatus = to as ReferralStatus;

  // Same-status is idempotent — allowed.
  if (fromStatus === toStatus) return { valid: true };

  // Transitioning to lost_contact is allowed from any active status.
  if (toStatus === "lost_contact") return { valid: true };

  // Transitioning OUT of lost_contact requires admin reset — caller must
  // explicitly clear it first.
  if (fromStatus === "lost_contact") {
    return {
      valid: false,
      reason:
        'Cannot transition out of "lost_contact" directly. Admin must reset the referral to an active status first.',
    };
  }

  // Forward progress check.
  const fromIdx = STATUS_PROGRESSION.indexOf(fromStatus);
  const toIdx = STATUS_PROGRESSION.indexOf(toStatus);

  if (toIdx <= fromIdx) {
    return {
      valid: false,
      reason: `Cannot regress from "${fromStatus}" to "${toStatus}". Status can only advance forward.`,
    };
  }

  return { valid: true };
}

/** Type guard: string is a valid ReferralStatus. */
export function isReferralStatus(s: string): s is ReferralStatus {
  return (REFERRAL_STATUSES as readonly string[]).includes(s);
}

/**
 * Type for the breakdown object stored in RewardWinner.scoreBreakdown.
 * Useful when reading/winning records back from Prisma.
 */
export type ScoreBreakdown = {
  total: number;
  counts: Partial<Record<ReferralStatus, number>>;
  weights: Record<ReferralStatus, number>;
};

/**
 * Serializes a ScoreBreakdown to JSON string for storage in RewardWinner.scoreBreakdown.
 */
export function serializeScoreBreakdown(b: ScoreBreakdown): string {
  return JSON.stringify(b);
}

/**
 * Parses a RewardWinner.scoreBreakdown JSON string back to a typed object.
 */
export function parseScoreBreakdown(json: string | null | undefined): ScoreBreakdown | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as ScoreBreakdown;
  } catch {
    return null;
  }
}

/**
 * Type alias for ReferralEvent including its relations, for scoring input.
 */
export type ReferralWithRelations = Prisma.ReferralEventGetPayload<{}>;
