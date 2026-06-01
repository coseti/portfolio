import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations} from 'next-intl/server';
import {CalButton} from '@/components/cal-button';
import {VideoPresentation} from '@/components/video-presentation';
import {getProspect} from '@/data/prospects';

const VIDEO_ID = process.env.NEXT_PUBLIC_PRESENTATION_VIDEO_ID ?? '';

// These links are sent privately to individual companies — keep them out of
// search engines entirely.
export const metadata: Metadata = {
  robots: {index: false, follow: false}
};

export default async function PresentationPage({
  params
}: {
  params: Promise<{locale: string; token: string}>;
}) {
  const {token} = await params;
  const prospect = getProspect(token);

  // Unknown / revoked token -> 404 (tokens are not guessable).
  if (!prospect) {
    notFound();
  }

  const t = await getTranslations('presentation');
  const greeting = prospect.contact
    ? t('greetingPerson', {contact: prospect.contact})
    : t('greetingTeam', {company: prospect.company});

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-[72px] max-w-[900px] items-center px-5 sm:px-8">
          <a
            href="https://migueldacal.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="migueldacal.com"
            className="font-serif text-[1.35rem] font-semibold tracking-tight transition-colors hover:text-primary"
          >
            MD
          </a>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto w-full max-w-[900px]">
          <span className="mb-3 inline-block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {greeting}
          </span>
          <h1 className="mb-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {t('title')}
          </h1>
          <p className="mb-8 max-w-[60ch] text-base leading-relaxed text-muted sm:text-[1.05rem]">
            {t('intro')}
          </p>

          {VIDEO_ID ? (
            <VideoPresentation
              videoId={VIDEO_ID}
              token={token}
              company={prospect.company}
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-border bg-surface text-center text-muted">
              <p className="max-w-[40ch] px-6">{t('unavailable')}</p>
            </div>
          )}

          <div className="mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="mb-2 font-serif text-xl font-semibold tracking-tight sm:text-2xl">
              {t('ctaTitle')}
            </h2>
            <p className="mb-5 max-w-[52ch] text-muted">{t('ctaSub')}</p>
            <div className="flex flex-wrap gap-3">
              <CalButton className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-[#0B0E14] shadow-[0_6px_20px_-8px_var(--primary)] transition-all hover:bg-primary-hover hover:shadow-[0_10px_26px_-10px_var(--primary)] active:translate-y-px">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {t('ctaBook')}
              </CalButton>
              <a
                href="https://www.linkedin.com/in/miguel-dacal/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary active:translate-y-px"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
                </svg>
                {t('ctaLinkedin')}
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-5 py-8 text-center text-sm text-muted sm:px-8">
        Miguel Dacal · migueldacal.com
      </footer>
    </div>
  );
}
