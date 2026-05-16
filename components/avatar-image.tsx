'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';

export function AvatarImage({src, alt}: {src: string; alt: string}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="View photo full size"
        className="relative block aspect-square w-full max-w-[360px] cursor-zoom-in overflow-hidden rounded-[24px] border border-border bg-surface-2"
        style={{boxShadow: 'var(--shadow-base)'}}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 280px, 360px"
          className="object-cover"
          unoptimized
          priority
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0E14]/95 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
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
              src={src}
              alt={alt}
              width={1200}
              height={1200}
              className="max-h-[90vh] w-auto rounded-lg object-contain"
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  );
}
