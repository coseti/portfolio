import {describe, it, expect, afterEach, vi} from 'vitest';
import crypto from 'node:crypto';

const URL_OK = 'https://n8n.example/webhook/contact';
const SECRET = 'contact-test-secret';

// route.ts reads the webhook env at module load, so re-import per env setup.
async function loadRoute(
  env: Record<string, string> = {
    N8N_CONTACT_WEBHOOK_URL: URL_OK,
    N8N_CONTACT_SECRET: SECRET
  }
) {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  return import('./route');
}

function post(body: unknown, raw = false) {
  return new Request('https://migueldacal.com/api/contact', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: raw ? (body as string) : JSON.stringify(body)
  });
}

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'I want to automate my lead intake.',
  phone: '',
  locale: 'es'
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('POST /api/contact', () => {
  it('returns 503 when the webhook is not configured', async () => {
    const {POST} = await loadRoute({
      N8N_CONTACT_WEBHOOK_URL: '',
      N8N_CONTACT_SECRET: ''
    });
    const res = await POST(post(VALID));
    expect(res.status).toBe(503);
  });

  it('returns 400 on invalid JSON', async () => {
    const {POST} = await loadRoute();
    const res = await POST(post('not json', true));
    expect(res.status).toBe(400);
  });

  it('rejects a missing name', async () => {
    const {POST} = await loadRoute();
    const res = await POST(post({...VALID, name: ''}));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({field: 'name'});
  });

  it('rejects an invalid email', async () => {
    const {POST} = await loadRoute();
    const res = await POST(post({...VALID, email: 'nope'}));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({field: 'email'});
  });

  it('rejects an invalid phone when one is provided', async () => {
    const {POST} = await loadRoute();
    const res = await POST(post({...VALID, phone: 'abc'}));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({field: 'phone'});
  });

  it('rejects a missing message', async () => {
    const {POST} = await loadRoute();
    const res = await POST(post({...VALID, message: ''}));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({field: 'message'});
  });

  it('forwards a valid submission with a correct HMAC signature', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ok: true, status: 200});
    vi.stubGlobal('fetch', fetchMock);

    const {POST} = await loadRoute();
    const res = await POST(post(VALID));

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
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      locale: 'es',
      source: 'migueldacal.com-contact-form'
    });
  });

  it('returns 502 when the upstream webhook fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: false, status: 500}));
    const {POST} = await loadRoute();
    const res = await POST(post(VALID));
    expect(res.status).toBe(502);
  });

  it('returns 500 when the upstream fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    const {POST} = await loadRoute();
    const res = await POST(post(VALID));
    expect(res.status).toBe(500);
  });
});
