'use client';

import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/navigation';
import {useTransition} from 'react';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = locale === 'en' ? 'es' : 'en';
    startTransition(() => {
      router.replace(pathname, {locale: next});
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label={locale === 'en' ? 'Cambiar a español' : 'Switch to English'}
      className="inline-flex h-9 items-center justify-center rounded-[10px] px-3 font-mono text-[0.78rem] font-medium uppercase tracking-[0.05em] text-muted transition-colors hover:bg-primary-soft hover:text-primary disabled:opacity-60"
    >
      {locale === 'en' ? 'EN' : 'ES'}
    </button>
  );
}
