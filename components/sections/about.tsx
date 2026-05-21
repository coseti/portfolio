import {useTranslations} from 'next-intl';
import {AvatarImage} from '@/components/avatar-image';

export function About() {
  const t = useTranslations('about');

  return (
    <section
      id="about"
      className="px-5 py-12 sm:px-8 sm:py-20 md:py-24"
      style={{scrollMarginTop: 'calc(72px + 16px)'}}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10 max-w-[720px]">
          <span className="mb-2 inline-block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            01 / About
          </span>
          <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
        </div>

        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16">
          <div className="md:sticky md:top-[calc(72px+24px)]">
            <AvatarImage
              src="https://res.cloudinary.com/df4zim15o/image/upload/01_avatar_mm8myg.png"
              alt="Miguel Dacal"
            />
          </div>

          <div>
            <p className="mb-4 text-[1.08rem] leading-relaxed text-foreground">
              {t('p1')}
            </p>
            <p className="mb-4 leading-relaxed text-muted">{t('p2')}</p>

            <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-8 md:grid-cols-3">
              <div>
                <dt className="mb-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted">
                  {t('locationLabel')}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {t('locationValue')}
                </dd>
              </div>
              <div>
                <dt className="mb-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted">
                  {t('focusLabel')}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {t('focusValue')}
                </dd>
              </div>
              <div>
                <dt className="mb-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted">
                  {t('statusLabel')}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {t('statusValue')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
