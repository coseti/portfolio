'use client';

import {useTranslations, useLocale} from 'next-intl';
import {useState, type FormEvent} from 'react';
import PhoneInput, {isValidPhoneNumber} from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import {CalButton} from '@/components/cal-button';

type Status = 'idle' | 'sending' | 'success' | 'error' | 'unavailable';
type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function Contact() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [phone, setPhone] = useState<string | undefined>(undefined);

  function validate(values: {
    name: string;
    email: string;
    message: string;
  }): FieldErrors {
    const errs: FieldErrors = {};
    if (!values.name) errs.name = t('errorNameRequired');
    if (!values.email) errs.email = t('errorEmailRequired');
    else if (!EMAIL_RE.test(values.email)) errs.email = t('errorEmailInvalid');
    if (phone && !isValidPhoneNumber(phone))
      errs.phone = t('errorPhoneInvalid');
    if (!values.message) errs.message = t('errorMessageRequired');
    return errs;
  }

  function validateEmailOnBlur(value: string) {
    const v = value.trim();
    setErrors((prev) => ({
      ...prev,
      email: !v
        ? t('errorEmailRequired')
        : !EMAIL_RE.test(v)
          ? t('errorEmailInvalid')
          : undefined
    }));
  }

  function validatePhoneOnBlur() {
    setErrors((prev) => ({
      ...prev,
      phone:
        phone && !isValidPhoneNumber(phone) ? t('errorPhoneInvalid') : undefined
    }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const values = {
      name: (data.get('name') || '').toString().trim(),
      email: (data.get('email') || '').toString().trim(),
      message: (data.get('message') || '').toString().trim()
    };

    const fieldErrors = validate(values);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      setStatus('idle');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...values, phone: phone ?? '', locale})
      });

      if (res.status === 204 || res.ok) {
        form.reset();
        setPhone(undefined);
        setErrors({});
        setStatus('success');
      } else if (res.status === 503) {
        setStatus('unavailable');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  function clearFieldError(field: keyof FieldErrors) {
    if (errors[field]) {
      setErrors((prev) => ({...prev, [field]: undefined}));
    }
  }

  const statusMessage =
    status === 'sending'
      ? t('sending')
      : status === 'success'
        ? t('success')
        : status === 'error'
          ? t('error')
          : status === 'unavailable'
            ? t('unavailable')
            : '';

  const labelCls = 'font-mono text-[0.74rem] uppercase tracking-[0.12em] text-muted';
  const baseInputCls =
    'rounded-[10px] border bg-surface px-4 py-3 text-[0.98rem] text-foreground transition-all placeholder:text-muted/70 focus:outline-none focus:ring-[3px]';
  const okInputCls = 'border-border focus:border-primary focus:ring-primary-soft';
  const errInputCls =
    'border-[#F87171] focus:border-[#F87171] focus:ring-[#F87171]/20';
  const errorTextCls = 'text-[0.82rem] text-[#F87171]';

  return (
    <section
      id="contact"
      className="px-5 py-12 sm:px-8 sm:py-20 md:py-24"
      style={{scrollMarginTop: 'calc(72px + 16px)'}}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10 max-w-[720px]">
          <span className="mb-2 inline-block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            06 / Contact
          </span>
          <h2 className="mb-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="text-base text-muted">{t('sub')}</p>
        </div>

        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-14">
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className={labelCls}>
                {t('nameLabel')}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder={t('namePh')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                onChange={() => clearFieldError('name')}
                className={`${baseInputCls} ${errors.name ? errInputCls : okInputCls}`}
              />
              {errors.name && (
                <p id="contact-name-error" className={errorTextCls}>
                  {errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className={labelCls}>
                {t('emailLabel')}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder={t('emailPh')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                onChange={() => clearFieldError('email')}
                onBlur={(e) => validateEmailOnBlur(e.target.value)}
                className={`${baseInputCls} ${errors.email ? errInputCls : okInputCls}`}
              />
              {errors.email && (
                <p id="contact-email-error" className={errorTextCls}>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-phone" className={labelCls}>
                {t('phoneLabel')}
              </label>
              <div
                className={`phone-field rounded-[10px] border ${
                  errors.phone ? 'border-[#F87171]' : 'border-border'
                } bg-surface px-3 py-2 transition-colors`}
              >
                <PhoneInput
                  id="contact-phone"
                  international
                  defaultCountry={locale === 'en' ? 'US' : 'ES'}
                  value={phone}
                  onChange={(v) => {
                    setPhone(v);
                    clearFieldError('phone');
                  }}
                  onBlur={validatePhoneOnBlur}
                  placeholder={t('phonePh')}
                />
              </div>
              {errors.phone && (
                <p id="contact-phone-error" className={errorTextCls}>
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className={labelCls}>
                {t('messageLabel')}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder={t('messagePh')}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                onChange={() => clearFieldError('message')}
                className={`${baseInputCls} resize-y ${
                  errors.message ? errInputCls : okInputCls
                }`}
              />
              {errors.message && (
                <p id="contact-message-error" className={errorTextCls}>
                  {errors.message}
                </p>
              )}
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
                  : status === 'error' || status === 'unavailable'
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
                <a
                  href={`/api/wa?locale=${locale}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center gap-3 rounded-[10px] border border-border bg-surface px-4 py-2.5 text-[0.95rem] transition-all hover:border-primary hover:bg-primary-soft hover:text-primary"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 2.01a9.97 9.97 0 0 0-8.55 15.13L2 22.01l4.99-1.31a9.96 9.96 0 0 0 4.76 1.21h.01c5.5 0 9.97-4.47 9.97-9.97a9.97 9.97 0 0 0-9.69-9.93z" />
                  </svg>
                  WhatsApp
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
