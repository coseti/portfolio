// Shared render helper for client-component tests. Only imported by jsdom
// test files, so it never pulls RTL into the node-env API route tests.
import '@testing-library/jest-dom/vitest';
import {afterEach} from 'vitest';
import {render, cleanup} from '@testing-library/react';
import {NextIntlClientProvider} from 'next-intl';
import type {ReactElement} from 'react';
import en from '@/messages/en.json';

afterEach(cleanup);

export function renderIntl(ui: ReactElement, locale: 'en' | 'es' = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={en}>
      {ui}
    </NextIntlClientProvider>
  );
}
