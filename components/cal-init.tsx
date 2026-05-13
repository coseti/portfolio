'use client';

import {useEffect} from 'react';
import {getCalApi} from '@calcom/embed-react';

// Initialize Cal.com EU embed once. Buttons using data-cal-* attrs
// open the modal with this namespace.
export function CalInit() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({
        namespace: 'intro',
        embedJsUrl: 'https://app.cal.eu/embed/embed.js'
      });
      cal('ui', {
        theme: 'dark',
        cssVarsPerTheme: {
          light: {'cal-brand': '#FBBF24'},
          dark: {'cal-brand': '#FBBF24'}
        },
        hideEventTypeDetails: false,
        layout: 'month_view'
      });
    })();
  }, []);

  return null;
}
