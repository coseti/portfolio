// @vitest-environment jsdom
import {describe, it, expect, vi, afterEach} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderIntl} from '@/test/intl-render';
import {ChatWidget} from '@/components/chat-widget';

// A fetch Response whose body streams `text` as a single chunk, matching what
// the widget consumes via res.body.getReader().
function streamResponse(text: string) {
  return {
    ok: true,
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(text));
        controller.close();
      }
    })
  };
}

const TOGGLE = 'Ask Miguel anything';

afterEach(() => vi.unstubAllGlobals());

describe('ChatWidget', () => {
  it('is closed initially and opens the dialog on toggle', async () => {
    renderIntl(<ChatWidget />);
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.click(screen.getByRole('button', {name: TOGGLE}));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows the suggestion prompts in the empty state', async () => {
    renderIntl(<ChatWidget />);
    await userEvent.click(screen.getByRole('button', {name: TOGGLE}));
    expect(
      screen.getByText('How can you help me get more leads?')
    ).toBeInTheDocument();
  });

  it('sends a message and renders the streamed assistant reply', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(streamResponse('Sure, I can help.'));
    vi.stubGlobal('fetch', fetchMock);

    renderIntl(<ChatWidget />);
    await userEvent.click(screen.getByRole('button', {name: TOGGLE}));
    await userEvent.type(
      screen.getByPlaceholderText('Type your question...'),
      'Can you help me?'
    );
    await userEvent.click(screen.getByRole('button', {name: 'Send'}));

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({method: 'POST'})
    );
    expect(await screen.findByText('Can you help me?')).toBeInTheDocument();
    expect(await screen.findByText('Sure, I can help.')).toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: false}));

    renderIntl(<ChatWidget />);
    await userEvent.click(screen.getByRole('button', {name: TOGGLE}));
    await userEvent.type(
      screen.getByPlaceholderText('Type your question...'),
      'hi'
    );
    await userEvent.click(screen.getByRole('button', {name: 'Send'}));

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });
});
