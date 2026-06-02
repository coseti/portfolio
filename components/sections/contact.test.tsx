// @vitest-environment jsdom
import {describe, it, expect, vi, afterEach} from 'vitest';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderIntl} from '@/test/intl-render';
import {Contact} from '@/components/sections/contact';

afterEach(() => vi.unstubAllGlobals());

describe('Contact', () => {
  it('links WhatsApp through /api/wa, never exposing a wa.me URL', () => {
    renderIntl(<Contact />);
    const wa = screen.getByRole('link', {name: /whatsapp/i});
    expect(wa).toHaveAttribute('href', '/api/wa?locale=en');
    expect(wa.getAttribute('href')).not.toContain('wa.me');
  });

  it('shows validation errors and does not submit when fields are empty', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    renderIntl(<Contact />);
    await userEvent.click(screen.getByRole('button', {name: 'Send message'}));

    expect(await screen.findByText('Please enter your name')).toBeInTheDocument();
    expect(screen.getByText('Please enter your email')).toBeInTheDocument();
    expect(
      screen.getByText('Please write a short message')
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits a valid form and shows the success message', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ok: true, status: 204});
    vi.stubGlobal('fetch', fetchMock);

    renderIntl(<Contact />);
    await userEvent.type(screen.getByPlaceholderText('Your name'), 'Ada');
    await userEvent.type(
      screen.getByPlaceholderText('you@example.com'),
      'ada@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Tell me which process/i),
      'I want to automate lead intake.'
    );
    await userEvent.click(screen.getByRole('button', {name: 'Send message'}));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({method: 'POST'})
      )
    );
    expect(
      await screen.findByText('Thanks, your message has been sent.')
    ).toBeInTheDocument();
  });
});
