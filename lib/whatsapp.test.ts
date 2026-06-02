import {describe, it, expect} from 'vitest';
import {buildWhatsappUrl} from './whatsapp';

describe('buildWhatsappUrl', () => {
  it('strips +, spaces and dashes from the number', () => {
    const url = buildWhatsappUrl('+34 611-22-33-44', 'en');
    expect(url).toMatch(/^https:\/\/wa\.me\/34611223344\?text=/);
  });

  it('uses the English greeting for en', () => {
    const url = buildWhatsappUrl('34611223344', 'en');
    const text = new URL(url).searchParams.get('text');
    expect(text).toBe("Hi Miguel, I'm reaching out from your website.");
  });

  it('uses the Spanish greeting for es', () => {
    const url = buildWhatsappUrl('34611223344', 'es');
    const text = new URL(url).searchParams.get('text');
    expect(text).toBe('Hola Miguel, te escribo desde tu web.');
  });

  it('url-encodes the greeting in the query string', () => {
    const url = buildWhatsappUrl('34611223344', 'es');
    // Raw spaces must be encoded so the link is valid.
    expect(url).not.toMatch(/text=[^&]* /);
    expect(url).toContain('%20');
  });

  it('keeps only digits even with letters or symbols mixed in', () => {
    const url = buildWhatsappUrl('tel:(34) 611.223.344', 'en');
    expect(url).toMatch(/^https:\/\/wa\.me\/34611223344\?/);
  });
});
