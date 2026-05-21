import {useTranslations} from 'next-intl';

const STEPS = [
  {label: 'step1Label', body: 'step1Body'},
  {label: 'step2Label', body: 'step2Body'},
  {label: 'step3Label', body: 'step3Body'},
  {label: 'step4Label', body: 'step4Body'}
] as const;

export function Process() {
  const t = useTranslations('process');

  return (
    <section
      id="process"
      className="px-5 py-16 sm:px-8 sm:py-24 md:py-28"
      style={{scrollMarginTop: 'calc(72px + 16px)'}}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10 max-w-[720px]">
          <span className="mb-2 inline-block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            04 / Process
          </span>
          <h2 className="mb-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="text-base text-muted">{t('sub')}</p>
        </div>

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({label, body}) => (
            <li
              key={label}
              className="rounded-[16px] border border-border bg-surface p-5"
            >
              <div className="mb-3 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-primary">
                {t(label)}
              </div>
              <p className="text-[0.95rem] leading-relaxed text-muted">
                {t(body)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
