import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';

// Mock the OpenAI SDK so no real API call is made. vi.hoisted lets the mock
// factory reference the spy that the tests also assert against.
const {createMock} = vi.hoisted(() => ({createMock: vi.fn()}));
vi.mock('openai', () => ({
  OpenAI: vi.fn(function () {
    return {chat: {completions: {create: createMock}}};
  })
}));

import {POST} from './route';

async function* fakeStream(parts: string[]) {
  for (const p of parts) {
    yield {choices: [{delta: {content: p}}]};
  }
}

function post(body: unknown, raw = false) {
  return new Request('https://migueldacal.com/api/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: raw ? (body as string) : JSON.stringify(body)
  });
}

beforeEach(() => {
  createMock.mockReset();
  vi.stubEnv('OPENAI_API_KEY', 'test-key');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('POST /api/chat', () => {
  it('returns 503 when no API key is configured', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');
    const res = await POST(post({messages: [{role: 'user', content: 'hi'}]}));
    expect(res.status).toBe(503);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('returns 400 on invalid JSON', async () => {
    const res = await POST(post('not json', true));
    expect(res.status).toBe(400);
  });

  it('returns 400 for an empty messages array', async () => {
    const res = await POST(post({messages: []}));
    expect(res.status).toBe(400);
  });

  it('returns 400 when there are too many messages', async () => {
    const messages = Array.from({length: 21}, () => ({
      role: 'user',
      content: 'hi'
    }));
    const res = await POST(post({messages}));
    expect(res.status).toBe(400);
  });

  it('rejects a message with an invalid role', async () => {
    const res = await POST(
      post({messages: [{role: 'system', content: 'hi'}]})
    );
    expect(res.status).toBe(400);
  });

  it('rejects an over-long message', async () => {
    const res = await POST(
      post({messages: [{role: 'user', content: 'x'.repeat(1001)}]})
    );
    expect(res.status).toBe(400);
  });

  it('streams the assistant reply and injects the Spanish lang hint', async () => {
    createMock.mockResolvedValue(fakeStream(['Hola', ' mundo']));

    const res = await POST(
      post({messages: [{role: 'user', content: 'hola'}], locale: 'es'})
    );

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/plain');
    expect(await res.text()).toBe('Hola mundo');

    const args = createMock.mock.calls[0][0];
    expect(args.model).toBe('gpt-4o-mini');
    expect(args.stream).toBe(true);
    const system = args.messages[0];
    expect(system.role).toBe('system');
    expect(system.content).toContain('Default to Spanish');
  });

  it('returns 500 when the OpenAI call throws', async () => {
    createMock.mockRejectedValue(new Error('boom'));
    const res = await POST(
      post({messages: [{role: 'user', content: 'hola'}]})
    );
    expect(res.status).toBe(500);
  });
});
