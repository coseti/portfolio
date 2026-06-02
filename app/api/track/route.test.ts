import {describe, it, expect, afterEach, vi} from 'vitest';
import crypto from 'node:crypto';

const URL_OK = 'https://n8n.example/webhook/track';
const SECRET = 'track-test-secret';
const PROSPECTS = '{"tok123":{"company":"Acme","contact":"Jane"}}';

// Both route.ts and the prospects module read env at load time -> re-import.
async function loadRoute(
  env: Record<string, string> = {
    N8N_TRACK_WEBHOOK_URL: URL_OK,
    N8N_TRACK_SECRET: SECRET,
    PRESENTATION_PROSPECTS: PROSPECTS
  }
) {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  return import('./route');
}

function post(body: unknown, raw = false) {
  return new Request('https://migueldacal.com/api/track', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: raw ? (body as string) : JSON.stringify(body)
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('POST /api/track', () => {
  it('returns 503 when the tracking webhook is not configured', async () => {
    const {POST} = await loadRoute({
      N8N_TRACK_WEBHOOK_URL: '',
      N8N_TRACK_SECRET: '',
      PRESENTATION_PROSPECTS: PROSPECTS
    });
    const res = await POST(post({token: 'tok123', event: 'play'}));
    expect(res.status).toBe(503);
  });

  it('returns 400 on invalid JSON', async () => {
    const {POST} = await loadRoute();
    const res = await POST(post('nope', true));
    expect(res.status).toBe(400);
  });

  it('returns 400 when the token is not a string', async () => {
    const {POST} = await loadRoute();
    const res = await POST(post({token: 123, event: 'play'}));
    expect(res.status).toBe(400);
  });

  it('returns 404 for an unknown token', async () => {
    const {POST} = await loadRoute();
    const res = await POST(post({token: 'ghost', event: 'play'}));
    expect(res.status).toBe(404);
  });

  it('returns 400 for an event not in the allowlist', async () => {
    const {POST} = await loadRoute();
    const res = await POST(post({token: 'tok123', event: 'hack'}));
    expect(res.status).toBe(400);
  });

  it('forwards a valid event with HMAC, prospect data and clamped numbers', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ok: true, status: 200});
    vi.stubGlobal('fetch', fetchMock);

    const {POST} = await loadRoute();
    const res = await POST(
      post({
        token: 'tok123',
        event: 'progress_50',
        watchedSeconds: -5,
        duration: 120.7,
        percent: 999
      })
    );

    expect(res.status).toBe(204);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [calledUrl, init] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe(URL_OK);

    const sentBody = init.body as string;
    const expectedSig = crypto
      .createHmac('sha256', SECRET)
      .update(sentBody)
      .digest('hex');
    expect(init.headers['X-Webhook-Signature-256']).toBe(expectedSig);

    const payload = JSON.parse(sentBody);
    expect(payload).toMatchObject({
      token: 'tok123',
      company: 'Acme',
      contact: 'Jane',
      event: 'progress_50',
      watchedSeconds: 0, // negative clamped to 0
      duration: 121, // rounded
      percent: 100, // clamped to 100
      source: 'migueldacal.com-presentation'
    });
  });

  it('returns 502 when the upstream webhook fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: false, status: 500}));
    const {POST} = await loadRoute();
    const res = await POST(post({token: 'tok123', event: 'open'}));
    expect(res.status).toBe(502);
  });
});
