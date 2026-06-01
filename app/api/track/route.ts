import crypto from 'node:crypto';
import {getProspect} from '@/data/prospects';

export const runtime = 'nodejs';
export const maxDuration = 15;

// Separate webhook + secret from the contact form on purpose: a "video view" is
// a different flow than a "contact lead". Never reuse N8N_CONTACT_* here.
const WEBHOOK_URL = process.env.N8N_TRACK_WEBHOOK_URL ?? '';
const WEBHOOK_SECRET = process.env.N8N_TRACK_SECRET ?? '';

// Events the client is allowed to report. Anything else is rejected.
const ALLOWED_EVENTS = new Set([
  'open',
  'play',
  'progress_25',
  'progress_50',
  'progress_75',
  'complete',
  'close'
]);

function asNonNegativeInt(v: unknown, max: number): number {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) return 0;
  return Math.min(Math.round(v), max);
}

export async function POST(req: Request) {
  if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
    return Response.json({error: 'Tracking endpoint not configured'}, {status: 503});
  }

  let body: {
    token?: unknown;
    event?: unknown;
    watchedSeconds?: unknown;
    duration?: unknown;
    percent?: unknown;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({error: 'Invalid JSON'}, {status: 400});
  }

  // The token must map to a known prospect — otherwise we don't track it.
  if (typeof body.token !== 'string') {
    return Response.json({error: 'Invalid token'}, {status: 400});
  }
  const prospect = getProspect(body.token);
  if (!prospect) {
    return Response.json({error: 'Unknown token'}, {status: 404});
  }

  if (typeof body.event !== 'string' || !ALLOWED_EVENTS.has(body.event)) {
    return Response.json({error: 'Invalid event'}, {status: 400});
  }

  const payload = {
    token: body.token,
    company: prospect.company,
    contact: prospect.contact ?? '',
    event: body.event,
    watchedSeconds: asNonNegativeInt(body.watchedSeconds, 86400),
    duration: asNonNegativeInt(body.duration, 86400),
    percent: asNonNegativeInt(body.percent, 100),
    occurredAt: new Date().toISOString(),
    source: 'migueldacal.com-presentation'
  };

  const rawBody = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  try {
    const upstream = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature-256': signature
      },
      body: rawBody
    });

    if (!upstream.ok) {
      console.error('Upstream track webhook returned non-OK status:', upstream.status);
      return Response.json({error: 'Upstream error'}, {status: 502});
    }

    return new Response(null, {status: 204});
  } catch (e) {
    console.error('Track webhook fetch error:', e);
    return Response.json({error: 'Network error'}, {status: 500});
  }
}
