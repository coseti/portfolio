'use client';

import {useEffect, useRef} from 'react';

// Minimal typings for the YouTube IFrame Player API (we only use a slice of it).
type YTPlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};
type YTStateChangeEvent = {data: number; target: YTPlayer};
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      width?: string;
      height?: string;
      playerVars?: Record<string, number>;
      events?: {onStateChange?: (e: YTStateChangeEvent) => void};
    }
  ) => YTPlayer;
  PlayerState: {PLAYING: number; ENDED: number};
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const API_SRC = 'https://www.youtube.com/iframe_api';
const MILESTONES = [25, 50, 75] as const;

// Load the IFrame API once; resolve when YT is ready (idempotent across mounts).
function loadYouTubeApi(): Promise<YTNamespace> {
  return new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT) resolve(window.YT);
    };
    if (!document.getElementById('youtube-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api';
      script.src = API_SRC;
      document.head.appendChild(script);
    }
  });
}

export function VideoPresentation({
  videoId,
  token,
  company
}: {
  videoId: string;
  token: string;
  company: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const sentRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const sent = sentRef.current;

    function metrics() {
      const player = playerRef.current;
      const watchedSeconds = player ? Math.round(player.getCurrentTime() || 0) : 0;
      const duration = player ? Math.round(player.getDuration() || 0) : 0;
      const percent =
        duration > 0 ? Math.min(100, Math.round((watchedSeconds / duration) * 100)) : 0;
      return {watchedSeconds, duration, percent};
    }

    // Fire-and-forget event, deduped by name so each milestone reports once.
    function send(event: string) {
      if (sent.has(event)) return;
      sent.add(event);
      const body = JSON.stringify({token, company, event, ...metrics()});
      fetch('/api/track', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body,
        keepalive: true
      }).catch(() => {});
    }

    function startTracking() {
      if (intervalRef.current != null) return;
      intervalRef.current = window.setInterval(() => {
        const {percent} = metrics();
        for (const m of MILESTONES) {
          if (percent >= m) send(`progress_${m}`);
        }
      }, 1000);
    }

    function stopTracking() {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Page opened — fires even if they never press play.
    send('open');

    loadYouTubeApi().then((YT) => {
      if (cancelled || !wrapperRef.current) return;
      // YT replaces the target node with an iframe; give it a throwaway child
      // so React keeps owning the (empty) wrapper and cleanup stays safe.
      const target = document.createElement('div');
      wrapperRef.current.appendChild(target);
      playerRef.current = new YT.Player(target, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {rel: 0, modestbranding: 1, playsinline: 1},
        events: {
          onStateChange: (e) => {
            if (!window.YT) return;
            if (e.data === window.YT.PlayerState.PLAYING) {
              send('play');
              startTracking();
            } else if (e.data === window.YT.PlayerState.ENDED) {
              send('complete');
              stopTracking();
            } else {
              stopTracking();
            }
          }
        }
      });
    });

    // Final beacon when the user leaves mid-video — captures partial watches
    // that never reached a milestone. `pagehide` alone is unreliable on mobile:
    // phones rarely "close" the tab, they background the app / lock the screen,
    // and browsers may freeze the page without ever firing pagehide. The only
    // event that fires reliably before that on mobile is visibilitychange ->
    // hidden, so we drive the beacon off both. Guarded so the two events don't
    // double-send on desktop close; rearmed when the page becomes visible again
    // so a later real exit still reports the latest position.
    let closeSent = false;

    function sendCloseBeacon() {
      if (closeSent) return;
      const {watchedSeconds, duration, percent} = metrics();
      if (watchedSeconds <= 0) return;
      closeSent = true;
      const body = JSON.stringify({
        token,
        company,
        event: 'close',
        watchedSeconds,
        duration,
        percent
      });
      navigator.sendBeacon?.(
        '/api/track',
        new Blob([body], {type: 'application/json'})
      );
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        sendCloseBeacon();
      } else {
        closeSent = false;
      }
    }
    window.addEventListener('pagehide', sendCloseBeacon);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      window.removeEventListener('pagehide', sendCloseBeacon);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopTracking();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, token, company]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
      <div ref={wrapperRef} className="aspect-video w-full" />
    </div>
  );
}
