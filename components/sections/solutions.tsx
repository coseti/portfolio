import Image from 'next/image';
import {useTranslations} from 'next-intl';

const ITEMS = ['s1', 's2', 's3', 's4', 's5'] as const;

const AVATAR_SRC =
  'https://res.cloudinary.com/df4zim15o/image/upload/01_avatar_mm8myg.png';

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
          <div className="mb-3 flex items-center gap-3">
            <a
              href="#about"
              aria-label="Miguel Dacal"
              className="block h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-surface-2 transition-all hover:border-primary"
            >
              <Image
                src={AVATAR_SRC}
                alt=""
                width={96}
                height={96}
                className="h-full w-full object-cover"
                unoptimized
              />
            </a>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              02 / Solutions
            </span>
          </div>
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
