import {useTranslations, useLocale} from 'next-intl';
import {CalButton} from '@/components/cal-button';

export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-85"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 30%, var(--primary-soft), transparent 70%), radial-gradient(ellipse 40% 30% at 80% 70%, var(--primary-soft), transparent 70%)'
        }}
      />

      <div className="relative mx-auto flex max-w-[760px] flex-col">
        <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
          {t('eyebrow')}
        </span>

        <h1 className="hero-title-gradient mb-3 pb-2 font-serif text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
          {t('title')}
        </h1>

        <h2 className="mb-4 max-w-[32ch] font-serif text-xl leading-snug text-foreground sm:text-2xl md:text-[1.6rem]">
          {t('tagline')}
        </h2>

        <p className="mb-8 max-w-[56ch] text-base leading-relaxed text-muted sm:text-[1.05rem]">
          {t('bio')}
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.linkedin.com/in/miguel-dacal/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-[#0B0E14] shadow-[0_6px_20px_-8px_var(--primary)] transition-all hover:bg-primary-hover hover:shadow-[0_10px_26px_-10px_var(--primary)] active:translate-y-px"
          >
            {t('ctaPrimary')}
          </a>
          <a
            href="#solutions"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary active:translate-y-px"
          >
            {t('ctaSecondary')}
          </a>
          <CalButton className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary active:translate-y-px">
            {t('ctaTertiary')}
          </CalButton>
          <a
            href={`/api/wa?locale=${locale}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary active:translate-y-px"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
              <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 2.01a9.97 9.97 0 0 0-8.55 15.13L2 22.01l4.99-1.31a9.96 9.96 0 0 0 4.76 1.21h.01c5.5 0 9.97-4.47 9.97-9.97a9.97 9.97 0 0 0-9.69-9.93z" />
            </svg>
            {t('ctaWhatsapp')}
          </a>
        </div>
      </div>
    </section>
  );
}
