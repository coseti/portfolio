import {useTranslations} from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          © {year} {t('name')}. {t('rights')}
        </p>
        <a
          href="#hero"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
        >
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}
