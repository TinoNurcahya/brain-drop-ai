/**
 * BrainDrop AI — PII & Sensitive Data Sanitizer
 * Detects and redacts PII before cloud inference.
 */

export interface SanitizeResult {
  sanitized: string;
  redactions: Redaction[];
  containsPII: boolean;
}

export interface Redaction {
  type: string;
  original: string;
  replacement: string;
  startIndex: number;
  endIndex: number;
}

const PII_PATTERNS: Array<{ type: string; regex: RegExp; replacement: string }> = [
  { type: "EMAIL", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: "[REDACTED_EMAIL]" },
  { type: "PHONE", regex: /(?:\+62|62|0)\d{8,12}/g, replacement: "[REDACTED_PHONE]" },
  { type: "CREDIT_CARD", regex: /\b(?:\d{4}[- ]?){3}\d{4}\b/g, replacement: "[REDACTED_CC]" },
  { type: "SSN_NIK", regex: /\b\d{16}\b/g, replacement: "[REDACTED_ID]" },
  { type: "IP_ADDRESS", regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, replacement: "[REDACTED_IP]" },
  { type: "API_KEY", regex: /(?:api[_-]?key|apikey|token|secret|password)\s*[:=]\s*['"`]?[A-Za-z0-9_\-]{20,}['"`]?/gi, replacement: "[REDACTED_SECRET]" },
];

export function sanitize(text: string): SanitizeResult {
  const redactions: Redaction[] = [];
  let sanitized = text;

  for (const pattern of PII_PATTERNS) {
    let match: RegExpExecArray | null;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    while ((match = regex.exec(text)) !== null) {
      redactions.push({
        type: pattern.type,
        original: match[0],
        replacement: pattern.replacement,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
    sanitized = sanitized.replace(new RegExp(pattern.regex.source, pattern.regex.flags), pattern.replacement);
  }

  return { sanitized, redactions, containsPII: redactions.length > 0 };
}

export function containsPII(text: string): boolean {
  return PII_PATTERNS.some((p) => new RegExp(p.regex.source, p.regex.flags).test(text));
}
