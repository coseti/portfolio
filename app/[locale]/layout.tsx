import type {Metadata} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {Inter, Fraunces, JetBrains_Mono} from 'next/font/google';
import {routing} from '@/i18n/routing';
import {Nav} from '@/components/nav';
import {ThemeScript} from '@/components/theme-script';
import {CalInit} from '@/components/cal-init';
import {ChatWidget} from '@/components/chat-widget';
import '../globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap'
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap'
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Miguel Dacal — AI Automation + Paid Growth',
  description:
    'From ad click to booked appointment — AI automation and paid growth, end to end.',
  metadataBase: new URL('https://migueldacal.com'),
  openGraph: {
    type: 'website',
    title: 'Miguel Dacal — AI Automation + Paid Growth',
    description:
      'From ad click to booked appointment — AI automation and paid growth, end to end.',
    url: 'https://migueldacal.com'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miguel Dacal — AI Automation + Paid Growth',
    description:
      'From ad click to booked appointment — AI automation and paid growth, end to end.'
  }
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <Nav />
          {children}
          <ChatWidget />
          <CalInit />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
