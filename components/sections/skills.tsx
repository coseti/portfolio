import {useTranslations} from 'next-intl';
import {skillsByCategory, type SkillCategory} from '@/data/skills';

const CATEGORIES: SkillCategory[] = ['aiAutomation', 'backend', 'growth', 'tools'];

export function Skills() {
  const t = useTranslations('skills');

  return (
    <section
      id="skills"
      className="px-5 py-16 sm:px-8 sm:py-24 md:py-28"
      style={{scrollMarginTop: 'calc(72px + 16px)'}}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10 max-w-[720px]">
          <span className="mb-2 inline-block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            03 / Stack
          </span>
          <h2 className="mb-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="text-base text-muted">{t('sub')}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <div
              key={category}
              className="rounded-[16px] border border-border bg-surface p-5"
            >
              <h3 className="mb-4 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-primary">
                {t(category)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillsByCategory[category].map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex rounded-full border border-border bg-surface-2 px-3 py-1.5 text-[0.88rem] text-foreground transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
