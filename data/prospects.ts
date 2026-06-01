// Outreach prospects for the personalized presentation pages (/p/[token]).
//
// The token -> company map is PRIVATE: it must never land in the public repo
// (it would reveal who we're targeting and make the "non-guessable" tokens
// guessable). So the data lives in the PRESENTATION_PROSPECTS env var, NOT here.
// This module only holds the parsing + lookup logic.
//
// PRESENTATION_PROSPECTS is a JSON object: token -> {company, contact?}, e.g.
//   {"0123456789":{"company":"Acme"},"abcdef0123":{"company":"Globex","contact":"Jane"}}
// It is server-only (NOT NEXT_PUBLIC): only the single matched company name is
// ever sent to the browser, never the whole list.
//
// Generate a fresh token with:
//   node -e "console.log(require('crypto').randomBytes(5).toString('hex'))"

export type Prospect = {
  /** Display name shown in the personalized greeting. */
  company: string;
  /** Optional contact person; enables a first-name greeting. */
  contact?: string;
};

function parseProspects(): Record<string, Prospect> {
  const raw = process.env.PRESENTATION_PROSPECTS;
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const out: Record<string, Prospect> = {};
    for (const [token, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (value && typeof value === 'object') {
        const v = value as {company?: unknown; contact?: unknown};
        if (typeof v.company === 'string' && v.company.trim()) {
          out[token] = {
            company: v.company,
            ...(typeof v.contact === 'string' && v.contact.trim()
              ? {contact: v.contact}
              : {})
          };
        }
      }
    }
    return out;
  } catch {
    console.error('PRESENTATION_PROSPECTS is not valid JSON — ignoring it.');
    return {};
  }
}

// Parsed once at module load. Changing the env var requires a redeploy/restart.
const prospects = parseProspects();

export function getProspect(token: string): Prospect | undefined {
  return Object.prototype.hasOwnProperty.call(prospects, token)
    ? prospects[token]
    : undefined;
}
