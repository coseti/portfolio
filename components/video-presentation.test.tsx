// @vitest-environment jsdom
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, waitFor, act, cleanup} from '@testing-library/react';
import {VideoPresentation} from '@/components/video-presentation';

type StateCb = (e: {data: number; target: unknown}) => void;

let onStateChange: StateCb | undefined;
let currentTime = 0;
let duration = 0;
let PlayerMock: ReturnType<typeof vi.fn>;
let fetchMock: ReturnType<typeof vi.fn>;

// The /api/track event names sent so far (fetch + sendBeacon use JSON bodies).
function eventsSent(): string[] {
  return fetchMock.mock.calls.map((c) => JSON.parse(c[1].body).event);
}

beforeEach(() => {
  onStateChange = undefined;
  currentTime = 0;
  duration = 0;

  const player = {
    getCurrentTime: () => currentTime,
    getDuration: () => duration,
    destroy: vi.fn()
  };
  PlayerMock = vi.fn(function (_el: HTMLElement, opts: {events: {onStateChange: StateCb}; videoId: string}) {
    onStateChange = opts.events.onStateChange;
    return player;
  });

  // Stub the YouTube IFrame API as already-loaded so loadYouTubeApi resolves.
  (window as unknown as {YT: unknown}).YT = {
    PlayerState: {PLAYING: 1, ENDED: 0},
    Player: PlayerMock
  };

  fetchMock = vi.fn().mockResolvedValue({ok: true});
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  cleanup(); // unmount so each test's pagehide listener is removed
  vi.unstubAllGlobals();
  vi.useRealTimers();
  delete (window as unknown as {YT?: unknown}).YT;
});

function renderVideo() {
  return render(
    <VideoPresentation videoId="vid123" token="tok123" company="Acme" />
  );
}

describe('VideoPresentation tracking', () => {
  it('sends an "open" event on mount', async () => {
    renderVideo();
    await waitFor(() => expect(eventsSent()).toContain('open'));
  });

  it('initializes the player with the given videoId', async () => {
    renderVideo();
    await waitFor(() => expect(PlayerMock).toHaveBeenCalled());
    expect(PlayerMock.mock.calls[0][1].videoId).toBe('vid123');
  });

  it('sends "play" when the player starts', async () => {
    renderVideo();
    await waitFor(() => expect(onStateChange).toBeTypeOf('function'));
    act(() => onStateChange!({data: 1, target: {}}));
    expect(eventsSent()).toContain('play');
  });

  it('sends "complete" when the video ends', async () => {
    renderVideo();
    await waitFor(() => expect(onStateChange).toBeTypeOf('function'));
    act(() => onStateChange!({data: 0, target: {}}));
    expect(eventsSent()).toContain('complete');
  });

  it('reports each progress milestone once, based on percent watched', async () => {
    renderVideo();
    await waitFor(() => expect(onStateChange).toBeTypeOf('function'));

    currentTime = 60;
    duration = 100;
    vi.useFakeTimers();
    act(() => onStateChange!({data: 1, target: {}}));
    act(() => vi.advanceTimersByTime(1000));

    const sent = eventsSent();
    expect(sent).toContain('progress_25');
    expect(sent).toContain('progress_50');
    expect(sent).not.toContain('progress_75');

    // Dedup: another tick must not re-send an already-reported milestone.
    act(() => vi.advanceTimersByTime(1000));
    expect(eventsSent().filter((e) => e === 'progress_50')).toHaveLength(1);
  });

  it('sends a close beacon on pagehide when the video was watched', async () => {
    const beacon = vi.fn();
    (navigator as unknown as {sendBeacon: unknown}).sendBeacon = beacon;

    renderVideo();
    await waitFor(() => expect(PlayerMock).toHaveBeenCalled());

    currentTime = 10;
    duration = 100;
    act(() => window.dispatchEvent(new Event('pagehide')));

    expect(beacon).toHaveBeenCalledTimes(1);
    expect(beacon.mock.calls[0][0]).toBe('/api/track');
  });
});
