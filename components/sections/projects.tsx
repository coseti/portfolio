import {useTranslations} from 'next-intl';
import Image from 'next/image';
import {projects} from '@/data/projects';

export function Projects() {
  const t = useTranslations('projects');

  return (
    <section
      id="projects"
      className="px-5 py-16 sm:px-8 sm:py-24 md:py-28"
      style={{scrollMarginTop: 'calc(72px + 16px)'}}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10 max-w-[720px]">
          <span className="mb-2 inline-block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            02 / Projects
          </span>
          <h2 className="mb-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="text-base text-muted">{t('sub')}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const tags = t(`${project.id}.tags`).split(' · ');
            return (
              <article
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-[16px] border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--primary)_50%,var(--border))] hover:shadow-[var(--shadow-base)]"
              >
                <div className="aspect-[16/10] overflow-hidden border-b border-border bg-surface-2">
                  {project.thumb ? (
                    <Image
                      src={project.thumb}
                      alt={project.thumbAlt ?? t(`${project.id}.title`)}
                      width={640}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-primary">
                      <span className="font-serif text-[3rem] opacity-30">
                        {project.id.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-[1.4rem] font-semibold leading-tight tracking-tight">
                      {t(`${project.id}.title`)}
                    </h3>
                    <span className="inline-flex shrink-0 items-center rounded-[6px] border border-border bg-surface-2 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                      {t(`${project.id}.status`)}
                    </span>
                  </div>

                  <p className="text-[0.97rem] leading-relaxed text-muted">
                    {t(`${project.id}.desc`)}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-[6px] border border-border bg-surface-2 px-2 py-1 font-mono text-[0.72rem] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
