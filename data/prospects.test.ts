import {describe, it, expect, afterEach, vi} from 'vitest';

// prospects.ts parses PRESENTATION_PROSPECTS once at module load, so each test
// stubs the env and re-imports the module fresh.
async function load(rawEnv: string | undefined) {
  vi.resetModules();
  vi.stubEnv('PRESENTATION_PROSPECTS', rawEnv ?? '');
  return import('./prospects');
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('getProspect', () => {
  it('returns undefined when the env var is unset', async () => {
    const {getProspect} = await load(undefined);
    expect(getProspect('whatever')).toBeUndefined();
  });

  it('looks up a known token (company only)', async () => {
    const {getProspect} = await load('{"abc123":{"company":"Acme"}}');
    expect(getProspect('abc123')).toEqual({company: 'Acme'});
  });

  it('includes contact when present and non-empty', async () => {
    const {getProspect} = await load(
      '{"abc123":{"company":"Globex","contact":"Jane"}}'
    );
    expect(getProspect('abc123')).toEqual({company: 'Globex', contact: 'Jane'});
  });

  it('drops a blank contact rather than exposing an empty string', async () => {
    const {getProspect} = await load(
      '{"abc123":{"company":"Acme","contact":"   "}}'
    );
    expect(getProspect('abc123')).toEqual({company: 'Acme'});
  });

  it('returns undefined for an unknown token', async () => {
    const {getProspect} = await load('{"abc123":{"company":"Acme"}}');
    expect(getProspect('nope')).toBeUndefined();
  });

  it('ignores entries without a usable company', async () => {
    const {getProspect} = await load(
      '{"a":{"company":""},"b":{"company":"   "},"c":{"contact":"x"}}'
    );
    expect(getProspect('a')).toBeUndefined();
    expect(getProspect('b')).toBeUndefined();
    expect(getProspect('c')).toBeUndefined();
  });

  it('does not match inherited Object.prototype keys', async () => {
    const {getProspect} = await load('{"abc123":{"company":"Acme"}}');
    expect(getProspect('toString')).toBeUndefined();
    expect(getProspect('hasOwnProperty')).toBeUndefined();
  });

  it('returns no prospects when the JSON is malformed', async () => {
    const {getProspect} = await load('{not valid json');
    expect(getProspect('abc123')).toBeUndefined();
  });

  it('returns no prospects when the JSON is not an object', async () => {
    const {getProspect} = await load('"a string"');
    expect(getProspect('abc123')).toBeUndefined();
  });
});
