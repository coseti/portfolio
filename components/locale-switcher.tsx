'use client';

import {useLocale} from 'next-intl';
import {useTransition} from 'react';
import {useRouter, usePathname} from '@/i18n/navigation';

const LOCALES = [
  {code: 'es', label: 'Español', switchLabel: 'Cambiar a español'},
  {code: 'en', label: 'English', switchLabel: 'Switch to English'}
] as const;

type LocaleCode = (typeof LOCALES)[number]['code'];

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: LocaleCode) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, {locale: next});
    });
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-0.5 text-[0.85rem]"
    >
      {LOCALES.map((item) =>
        item.code === locale ? (
          <span
            key={item.code}
            aria-current="true"
            className="inline-flex h-8 items-center rounded-[8px] bg-primary-soft px-2.5 font-medium text-primary"
          >
            {item.label}
          </span>
        ) : (
          <button
            key={item.code}
            type="button"
            onClick={() => switchTo(item.code)}
            disabled={isPending}
            aria-label={item.switchLabel}
            className="inline-flex h-8 items-center rounded-[8px] px-2.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-60"
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
