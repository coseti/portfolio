import {buildWhatsappUrl} from '@/lib/whatsapp';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  // Server-only: the phone number lives in env and is never exposed to the
  // client. The page links to /api/wa, NOT a wa.me URL, so passive HTML
  // scrapers never see the number — only clients that follow the redirect.
  const phone = process.env.WHATSAPP_PHONE ?? '';

  // Not configured -> bounce to home instead of erroring out.
  if (!phone) {
    return Response.redirect(new URL('/', req.url), 307);
  }

  const locale =
    new URL(req.url).searchParams.get('locale') === 'es' ? 'es' : 'en';

  return Response.redirect(buildWhatsappUrl(phone, locale), 307);
}
