/**
 * Referral code generator for Go-A-Fishing members.
 *
 * Format: REH-{XXXXXX} where XXXXXX is a 6-character base32 string.
 * - Alphabet excludes ambiguous characters: 0, 1, I, L, O (readable when
 *   printed on flyers, readable when dictated over phone).
 * - Case-insensitive (uppercase on creation, lowercase lookups also work).
 * - ~800M possible codes (32^6) — collision-safe for any church scale.
 *
 * Stage 3 of Go-A-Fishing.
 */

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // 28 chars (no I/L/O/0/1)
const CODE_LENGTH = 6;
const PREFIX = "REH";

/**
 * Generates a fresh referral code in the format `REH-XXXXXX`.
 * Pure function — does NOT check for DB collisions. Caller is responsible for
 * uniqueness verification (typically via Prisma unique constraint retry).
 *
 * @example generateReferralCode() // "REH-K7QPMX"
 */
export function generateReferralCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    // crypto.webcrypto is available in both Node 18+ and modern browsers.
    const randomIndex = Math.floor(cryptoRandom() * ALPHABET.length);
    code += ALPHABET[randomIndex];
  }
  return `${PREFIX}-${code}`;
}

/**
 * Generates a referral code and retries on DB uniqueness collision.
 * Caller passes a `codeExists` predicate (typically a Prisma lookup).
 *
 * @example
 *   const code = await generateUniqueReferralCode(
 *     async (c) => (await prisma.member.findUnique({ where: { referralCode: c } })) !== null
 *   );
 */
export async function generateUniqueReferralCode(
  codeExists: (code: string) => Promise<boolean>,
  maxAttempts = 10
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = generateReferralCode();
    if (!(await codeExists(code))) {
      return code;
    }
  }
  throw new Error(
    `Failed to generate a unique referral code after ${maxAttempts} attempts.`
  );
}

/**
 * Normalizes a referral code for case-insensitive lookup.
 * Accepts "reh-ab1234", "REH-AB1234", "reh AB1234" → "REH-AB1234".
 */
export function normalizeReferralCode(input: string): string {
  const trimmed = input.trim().toUpperCase().replace(/\s+/g, "-");
  if (!trimmed.startsWith(`${PREFIX}-`)) {
    // Allow lookup by bare code (no prefix).
    return `${PREFIX}-${trimmed}`;
  }
  return trimmed;
}

/**
 * Validates that a string is a well-formed referral code.
 * Does NOT check existence in DB.
 */
export function isValidReferralCode(input: string): boolean {
  const normalized = normalizeReferralCode(input);
  const pattern = new RegExp(`^${PREFIX}-[${ALPHABET}]{${CODE_LENGTH}}$`);
  return pattern.test(normalized);
}

/**
 * Crypto-safe random number in [0, 1).
 * Uses Web Crypto API (available in Node 18+ and all modern browsers).
 * Falls back to Math.random() only in legacy environments.
 */
function cryptoRandom(): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] / (0xffffffff + 1);
  }
  // Legacy fallback — should never hit this in Next.js runtime.
  return Math.random();
}
