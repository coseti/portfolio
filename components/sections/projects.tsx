import {useTranslations} from 'next-intl';
import {projects} from '@/data/projects';
import {ProjectCard} from '@/components/project-card';

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
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={t(`${project.id}.title`)}
              desc={t(`${project.id}.desc`)}
              status={t(`${project.id}.status`)}
              tags={t(`${project.id}.tags`).split(' · ')}
              images={project.images}
              fallbackLabel={project.id.toUpperCase()}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
