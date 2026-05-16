'use client';

import {useState, useRef, useEffect} from 'react';
import type {KeyboardEvent} from 'react';
import {useLocale, useTranslations} from 'next-intl';

type Msg = {role: 'user' | 'assistant'; content: string};

const SUGGESTION_KEYS = ['suggestion1', 'suggestion2', 'suggestion3'] as const;

export function ChatWidget() {
  const t = useTranslations('chat');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    const userMsg: Msg = {role: 'user', content: text};
    const baseMessages = [...messages, userMsg];

    setMessages([...baseMessages, {role: 'assistant', content: ''}]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages: baseMessages, locale})
      });

      if (!res.ok || !res.body) {
        setMessages([...baseMessages, {role: 'assistant', content: t('error')}]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';

      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        acc += decoder.decode(value, {stream: true});
        setMessages([...baseMessages, {role: 'assistant', content: acc}]);
      }
    } catch {
      setMessages([...baseMessages, {role: 'assistant', content: t('error')}]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('toggle')}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-[#0B0E14] shadow-[0_8px_24px_-8px_var(--primary)] transition-transform hover:scale-105 active:scale-95"
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-labelledby="chat-title"
          className="fixed bottom-24 right-6 z-40 flex h-[min(560px,80vh)] w-[min(380px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        >
          <header className="border-b border-border bg-surface-2 px-4 py-3">
            <h3 id="chat-title" className="font-serif text-base font-semibold text-foreground">
              {t('title')}
            </h3>
            <p className="text-xs text-muted">{t('subtitle')}</p>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="text-sm">
                <p className="mb-3 text-muted">{t('emptyLead')}</p>
                <div className="space-y-1.5">
                  {SUGGESTION_KEYS.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => send(t(k))}
                      className="block w-full rounded-md border border-border bg-background px-3 py-2 text-left text-xs text-foreground transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
                    >
                      {t(k)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-[#0B0E14]'
                      : 'max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-surface-2 px-3 py-2 text-sm text-foreground'
                  }
                >
                  {m.content || (loading && i === messages.length - 1 ? '…' : '')}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-surface-2 p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder={t('placeholder')}
                disabled={loading}
                className="max-h-32 min-h-9 flex-1 resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-soft disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => send()}
                disabled={!input.trim() || loading}
                aria-label={t('send')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-[#0B0E14] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
