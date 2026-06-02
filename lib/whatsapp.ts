type Locale = 'en' | 'es';

// Pre-filled greeting so the WhatsApp chat opens with context, not blank.
const GREETING: Record<Locale, string> = {
  en: "Hi Miguel, I'm reaching out from your website.",
  es: 'Hola Miguel, te escribo desde tu web.'
};

// Build the wa.me deep link from a raw phone number. The number is kept
// server-side only (env var) and never shipped to the client — this helper
// runs inside the /api/wa redirect handler.
export function buildWhatsappUrl(phone: string, locale: Locale): string {
  const digits = phone.replace(/\D/g, '');
  const text = encodeURIComponent(GREETING[locale]);
  return `https://wa.me/${digits}?text=${text}`;
}
