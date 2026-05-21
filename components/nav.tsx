'use client';

import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {LocaleSwitcher} from './locale-switcher';
import {ThemeToggle} from './theme-toggle';

const SECTIONS = [
  'about',
  'solutions',
  'projects',
  'process',
  'skills',
  'contact'
] as const;

export function Nav() {
  const t = useTranslations('nav');
  const tA11y = useTranslations('a11y');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-0 focus:top-0 focus:z-50 focus:rounded-br-[10px] focus:bg-primary focus:px-4 focus:py-2.5 focus:font-semibold focus:text-[#0B0E14]"
      >
        {tA11y('skip')}
      </a>
      <header
        className={`sticky top-0 z-50 backdrop-blur-md backdrop-saturate-150 transition-colors duration-300 ${
          scrolled ? 'border-b border-border' : 'border-b border-transparent'
        }`}
        style={{backgroundColor: 'color-mix(in srgb, var(--background) 85%, transparent)'}}
      >
        <div className="mx-auto flex h-[72px] max-w-[1100px] items-center justify-between px-5 lg:px-8">
          <a
            href="#hero"
            aria-label="Home"
            className="font-serif text-[1.35rem] font-semibold tracking-tight transition-colors hover:text-primary"
          >
            MD
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-[10px] lg:hidden"
          >
            <span
              className={`block h-[1.6px] w-[22px] rounded bg-foreground transition-transform duration-300 ${
                open ? 'translate-y-[6.6px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-[1.6px] w-[22px] rounded bg-foreground transition-opacity ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-[1.6px] w-[22px] rounded bg-foreground transition-transform duration-300 ${
                open ? '-translate-y-[6.6px] -rotate-45' : ''
              }`}
            />
          </button>

          <nav
            aria-label="Primary"
            className={`${
              open
                ? 'pointer-events-auto translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-3 opacity-0 lg:pointer-events-auto lg:translate-y-0 lg:opacity-100'
            } fixed left-0 right-0 top-[72px] flex flex-col items-start gap-0 border-b border-border bg-background px-5 pb-6 pt-3 transition-all duration-300 lg:static lg:flex-row lg:items-center lg:gap-6 lg:border-0 lg:bg-transparent lg:p-0`}
          >
            {SECTIONS.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="w-full border-b border-border py-3 text-[1.05rem] font-medium text-muted transition-colors hover:text-foreground lg:w-auto lg:border-0 lg:py-0 lg:text-[0.92rem]"
              >
                {t(id)}
              </a>
            ))}
            <span className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted lg:hidden">
              {t('language')}
            </span>
            <div className="mt-2 flex w-full items-center gap-2 border-l-0 pl-0 lg:ml-4 lg:mt-0 lg:w-auto lg:border-l lg:border-border lg:pl-4 lg:pt-0">
              <LocaleSwitcher />
              <a
                href="https://www.linkedin.com/in/miguel-dacal/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-primary-soft hover:text-primary"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
