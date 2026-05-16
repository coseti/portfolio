import crypto from 'node:crypto';

export const runtime = 'nodejs';
export const maxDuration = 15;

const WEBHOOK_URL = process.env.N8N_CONTACT_WEBHOOK_URL ?? '';
const WEBHOOK_SECRET = process.env.N8N_CONTACT_SECRET ?? '';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s\-()]{5,19}$/;

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= max;
}

export async function POST(req: Request) {
  if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
    return Response.json(
      {error: 'Contact endpoint not configured'},
      {status: 503}
    );
  }

  let body: {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    message?: unknown;
    locale?: unknown;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({error: 'Invalid JSON'}, {status: 400});
  }

  // Server-side validation (defense in depth — client already validates too)
  if (!isNonEmptyString(body.name, 200)) {
    return Response.json({field: 'name', error: 'required'}, {status: 400});
  }
  if (!isNonEmptyString(body.email, 200) || !EMAIL_RE.test(body.email)) {
    return Response.json({field: 'email', error: 'invalid'}, {status: 400});
  }
  if (
    body.phone !== undefined &&
    body.phone !== '' &&
    body.phone !== null &&
    (typeof body.phone !== 'string' ||
      body.phone.length > 30 ||
      !PHONE_RE.test(body.phone))
  ) {
    return Response.json({field: 'phone', error: 'invalid'}, {status: 400});
  }
  if (!isNonEmptyString(body.message, 5000)) {
    return Response.json({field: 'message', error: 'required'}, {status: 400});
  }

  const payload = {
    name: body.name.trim(),
    email: body.email.trim(),
    phone: typeof body.phone === 'string' ? body.phone.trim() : '',
    message: body.message.trim(),
    locale: body.locale === 'es' ? 'es' : 'en',
    submittedAt: new Date().toISOString(),
    source: 'portfolio-contact-form'
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
      console.error('Upstream webhook returned non-OK status:', upstream.status);
      return Response.json({error: 'Upstream error'}, {status: 502});
    }

    return new Response(null, {status: 204});
  } catch (e) {
    console.error('Contact webhook fetch error:', e);
    return Response.json({error: 'Network error'}, {status: 500});
  }
}
