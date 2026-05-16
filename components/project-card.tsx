'use client';

import {useState, useEffect, useCallback} from 'react';
import Image from 'next/image';
import type {ProjectImage} from '@/data/projects';

type Props = {
  title: string;
  desc: string;
  status: string;
  tags: string[];
  images: ProjectImage[];
  fallbackLabel: string;
};

export function ProjectCard({
  title,
  desc,
  status,
  tags,
  images,
  fallbackLabel
}: Props) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const hasImages = images.length > 0;
  const multi = images.length > 1;
  const safeIdx = Math.min(idx, Math.max(images.length - 1, 0));

  const go = useCallback(
    (delta: number) => {
      setIdx((i) => {
        const len = images.length;
        return (i + delta + len) % len;
      });
    },
    [images.length]
  );

  // Lightbox keyboard controls
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowLeft' && multi) go(-1);
      if (e.key === 'ArrowRight' && multi) go(1);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, multi, go]);

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-[16px] border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--primary)_50%,var(--border))] hover:shadow-[var(--shadow-base)]">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-2">
          {hasImages ? (
            <>
              <button
                type="button"
                onClick={() => setLightbox(true)}
                aria-label="View image full size"
                className="block h-full w-full cursor-zoom-in"
              >
                <Image
                  src={images[safeIdx].src}
                  alt={images[safeIdx].alt}
                  width={640}
                  height={400}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </button>

              {multi && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0B0E14]/70 text-white backdrop-blur transition-colors hover:bg-[#0B0E14]/90"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0B0E14]/70 text-white backdrop-blur transition-colors hover:bg-[#0B0E14]/90"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#0B0E14]/70 px-2.5 py-1 font-mono text-[0.7rem] text-white backdrop-blur">
                    {safeIdx + 1} / {images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-primary">
              <span className="font-serif text-[3rem] opacity-30">
                {fallbackLabel}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-[1.4rem] font-semibold leading-tight tracking-tight">
              {title}
            </h3>
            <span className="inline-flex shrink-0 items-center rounded-[6px] border border-border bg-surface-2 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
              {status}
            </span>
          </div>

          <p className="text-[0.97rem] leading-relaxed text-muted">{desc}</p>

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

      {lightbox && hasImages && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setLightbox(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0E14]/95 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>

          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[safeIdx].src}
              alt={images[safeIdx].alt}
              width={1600}
              height={1000}
              className="max-h-[90vh] w-auto rounded-lg object-contain"
              unoptimized
            />

            {multi && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
                <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 font-mono text-[0.8rem] text-white">
                  {safeIdx + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
