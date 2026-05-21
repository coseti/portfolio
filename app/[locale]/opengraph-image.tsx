import {ImageResponse} from 'next/og';

export const size = {width: 1200, height: 630};
export const contentType = 'image/png';
export const alt = 'Miguel Dacal — AI Automation + Paid Growth';

const COPY = {
  en: {
    eyebrow: 'Open to work · Madrid',
    tagline: 'Win qualified clients, get your hours back, sell without leaving it to luck.',
    sub: 'AI, automation and paid growth systems for SMBs and professionals.'
  },
  es: {
    eyebrow: 'Open to work · Madrid',
    tagline: 'Capta clientes cualificados, recupera tus horas, vende sin depender de la suerte.',
    sub: 'Sistemas de IA, automatización y growth para PYMEs y profesionales.'
  }
} as const;

type Locale = keyof typeof COPY;

export default async function OG({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = COPY[(locale in COPY ? locale : 'en') as Locale];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px 100px',
          background:
            'radial-gradient(ellipse 60% 40% at 30% 30%, rgba(251,191,36,0.18), transparent 70%), radial-gradient(ellipse 40% 30% at 80% 70%, rgba(251,191,36,0.18), transparent 70%), #0B0E14',
          color: '#F5F5F0',
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#8B92A3',
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginBottom: 28
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#22C55E',
              boxShadow: '0 0 14px #22C55E'
            }}
          />
          {t.eyebrow}
        </div>

        <div
          style={{
            fontSize: 110,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1.02,
            marginBottom: 28,
            color: '#F5F5F0'
          }}
        >
          Miguel Dacal
        </div>

        <div
          style={{
            fontSize: 44,
            fontWeight: 500,
            lineHeight: 1.25,
            letterSpacing: -1,
            color: '#F5F5F0',
            marginBottom: 16,
            maxWidth: 980
          }}
        >
          {t.tagline}
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            lineHeight: 1.35,
            color: '#8B92A3',
            maxWidth: 900
          }}
        >
          {t.sub}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 100,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 22,
            color: '#FBBF24',
            fontWeight: 600,
            letterSpacing: 1
          }}
        >
          <div style={{width: 32, height: 2, background: '#FBBF24'}} />
          migueldacal.com
        </div>
      </div>
    ),
    {...size}
  );
}
