'use client';

import {useTranslations} from 'next-intl';
import {useState, type FormEvent} from 'react';
import {CalButton} from '@/components/cal-button';

const EMAIL = 'miguelcoseti@gmail.com';
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? '';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      setStatus('error');
      return;
    }

    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent('Portfolio inquiry from ' + name);
      const body = encodeURIComponent(`${message}\n\n— ${name} <${email}>`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {Accept: 'application/json'},
        body: data
      });
      if (res.ok) {
        form.reset();
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const statusMessage =
    status === 'sending'
      ? t('sending')
      : status === 'success'
        ? t('success')
        : status === 'error'
          ? t('error')
          : '';

  return (
    <section
      id="contact"
      className="px-5 py-16 sm:px-8 sm:py-24 md:py-28"
      style={{scrollMarginTop: 'calc(72px + 16px)'}}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10 max-w-[720px]">
          <span className="mb-2 inline-block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            04 / Contact
          </span>
          <h2 className="mb-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="text-base text-muted">{t('sub')}</p>
        </div>

        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-14">
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-name"
                className="font-mono text-[0.74rem] uppercase tracking-[0.12em] text-muted"
              >
                {t('nameLabel')}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder={t('namePh')}
                required
                className="rounded-[10px] border border-border bg-surface px-4 py-3 text-[0.98rem] text-foreground transition-all placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary-soft"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-email"
                className="font-mono text-[0.74rem] uppercase tracking-[0.12em] text-muted"
              >
                {t('emailLabel')}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder={t('emailPh')}
                required
                className="rounded-[10px] border border-border bg-surface px-4 py-3 text-[0.98rem] text-foreground transition-all placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary-soft"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-message"
                className="font-mono text-[0.74rem] uppercase tracking-[0.12em] text-muted"
              >
                {t('messageLabel')}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder={t('messagePh')}
                required
                className="resize-y rounded-[10px] border border-border bg-surface px-4 py-3 text-[0.98rem] text-foreground transition-all placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary-soft"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-[#0B0E14] shadow-[0_6px_20px_-8px_var(--primary)] transition-all hover:bg-primary-hover hover:shadow-[0_10px_26px_-10px_var(--primary)] disabled:opacity-60"
            >
              {t('submit')}
            </button>
            <p
              role="status"
              aria-live="polite"
              className={`min-h-[1.2em] text-[0.92rem] ${
                status === 'success'
                  ? 'text-[#22C55E]'
                  : status === 'error'
                    ? 'text-[#F87171]'
                    : 'text-muted'
              }`}
            >
              {statusMessage}
            </p>
          </form>

          <aside>
            <p className="mb-4 text-muted">{t('sideLead')}</p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex w-full items-center gap-3 rounded-[10px] border border-border bg-surface px-4 py-2.5 text-[0.95rem] transition-all hover:border-primary hover:bg-primary-soft hover:text-primary"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                  {EMAIL}
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/miguel-dacal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center gap-3 rounded-[10px] border border-border bg-surface px-4 py-2.5 text-[0.95rem] transition-all hover:border-primary hover:bg-primary-soft hover:text-primary"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
                  </svg>
                  LinkedIn
                </a>
              </li>
              <li>
                <CalButton className="inline-flex w-full items-center gap-3 rounded-[10px] border border-border bg-surface px-4 py-2.5 text-[0.95rem] transition-all hover:border-primary hover:bg-primary-soft hover:text-primary">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {t('bookCall')}
                </CalButton>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
