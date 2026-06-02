import {describe, it, expect, afterEach, vi} from 'vitest';
import {GET} from './route';

afterEach(() => {
  vi.unstubAllEnvs();
});

function get(url: string) {
  return GET(new Request(url));
}

describe('GET /api/wa', () => {
  it('307-redirects to wa.me with the configured number', async () => {
    vi.stubEnv('WHATSAPP_PHONE', '34611223344');
    const res = await get('https://migueldacal.com/api/wa?locale=es');
    expect(res.status).toBe(307);
    const location = res.headers.get('location') ?? '';
    expect(location).toMatch(/^https:\/\/wa\.me\/34611223344\?text=/);
  });

  it('defaults to the en greeting when locale is missing or unknown', async () => {
    vi.stubEnv('WHATSAPP_PHONE', '34611223344');
    const res = await get('https://migueldacal.com/api/wa');
    const text = new URL(res.headers.get('location') ?? '').searchParams.get(
      'text'
    );
    expect(text).toBe("Hi Miguel, I'm reaching out from your website.");
  });

  it('never leaks the number when not configured -> redirects home', async () => {
    vi.stubEnv('WHATSAPP_PHONE', '');
    const res = await get('https://migueldacal.com/api/wa?locale=es');
    expect(res.status).toBe(307);
    const location = res.headers.get('location') ?? '';
    expect(location).toBe('https://migueldacal.com/');
    expect(location).not.toContain('wa.me');
  });
});
