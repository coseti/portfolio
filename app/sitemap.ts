import type {MetadataRoute} from 'next';
import {routing} from '@/i18n/routing';

const BASE_URL = 'https://migueldacal.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routing.locales.map((locale) => ({
    url: locale === routing.defaultLocale ? BASE_URL : `${BASE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale ? BASE_URL : `${BASE_URL}/${l}`
        ])
      )
    }
  }));
}
