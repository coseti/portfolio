import {useTranslations} from 'next-intl';

const ITEMS = ['s1', 's2', 's3', 's4', 's5'] as const;

export function Solutions() {
  const t = useTranslations('solutions');

  return (
    <section
      id="solutions"
      className="px-5 py-16 sm:px-8 sm:py-24 md:py-28"
      style={{scrollMarginTop: 'calc(72px + 16px)'}}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10 max-w-[720px]">
          <span className="mb-2 inline-block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            01 / Solutions
          </span>
          <h2 className="mb-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="text-base text-muted">{t('sub')}</p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2">
          {ITEMS.map((id) => (
            <li
              key={id}
              className="rounded-[16px] border border-border bg-surface p-6 transition-colors hover:border-primary/50"
            >
              <p className="mb-3 font-serif text-[1.15rem] font-semibold leading-snug text-foreground">
                <span className="mr-2 text-primary">“</span>
                {t(`${id}.pain`)}
                <span className="ml-1 text-primary">”</span>
              </p>
              <p className="text-[0.98rem] leading-relaxed text-muted">
                {t(`${id}.fix`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
