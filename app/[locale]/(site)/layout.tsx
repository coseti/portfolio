import {Nav} from '@/components/nav';
import {ChatWidget} from '@/components/chat-widget';

// Chrome for the main marketing site (home). The personalized presentation
// pages under /p/[token] live OUTSIDE this group, so they don't inherit the
// portfolio nav or chat widget — they get their own minimal header.
export default function SiteLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Nav />
      {children}
      <ChatWidget />
    </>
  );
}
