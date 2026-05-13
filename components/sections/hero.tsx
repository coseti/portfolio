import {useTranslations} from 'next-intl';

export function Hero() {
  const t = useTranslations('hero');

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

        <h1 className="hero-title-gradient mb-3 font-serif text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
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
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary active:translate-y-px"
          >
            {t('ctaSecondary')}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary active:translate-y-px"
          >
            {t('ctaTertiary')}
          </a>
        </div>
      </div>
    </section>
  );
}
