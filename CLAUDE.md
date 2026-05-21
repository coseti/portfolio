@AGENTS.md

# Portfolio — migueldacal.com

Personal portfolio site. Bilingual (ES/EN), dark-first, deployed on Vercel with
auto-deploy from `master`.

## Stack

- **Next.js 16** (App Router, TypeScript) — note: `middleware.ts` is `proxy.ts` in v16
- **Tailwind v4** — theme via `@theme inline` in `app/globals.css`, NOT `tailwind.config`
- **next-intl 4** — i18n routing, Accept-Language detection
- **@calcom/embed-react** — Cal.com EU modal (`cal.eu`, not `cal.com`)
- **openai** — gpt-4o-mini for the chat widget

## Commands

```bash
npm run dev      # dev server (Turbopack), localhost:3000
npm run build    # production build
npm run lint     # eslint
```

## Structure

```
app/
  [locale]/
    layout.tsx          # html shell, fonts, ThemeScript, Nav, ChatWidget, CalInit
    page.tsx            # composes the sections
    opengraph-image.tsx # dynamic OG image per locale
  api/
    chat/route.ts       # chat widget endpoint (OpenAI stream)
    contact/route.ts    # contact form -> signed forward to n8n webhook
  sitemap.ts, robots.ts, globals.css
components/
  nav.tsx, theme-script.tsx, theme-toggle.tsx, locale-switcher.tsx
  cal-init.tsx, cal-button.tsx, chat-widget.tsx
  sections/             # hero, about, solutions, projects, process, skills, contact, footer
data/
  projects.ts           # project metadata (ids, thumbs)
  skills.ts             # skills grouped by category
  miguel-context.ts     # knowledge base injected into chat system prompt
i18n/
  routing.ts, request.ts, navigation.ts
messages/
  en.json, es.json      # ALL UI copy lives here (next-intl)
proxy.ts                # next-intl middleware (v16 naming)
legacy/                 # gitignored backup of the old static HTML portfolio
```

## Conventions

- **All user-facing text** goes in `messages/{en,es}.json`. Never hardcode copy
  in components. Keep ES/EN keys in parity.
- **Theming**: colors are CSS vars in `app/globals.css` under `:root` (dark) and
  `[data-theme="light"]`, exposed to Tailwind via `@theme inline`. Use utilities
  like `bg-background`, `text-foreground`, `bg-primary`. No `dark:` variant needed.
- **Dark mode is the default and the brand identity.** `theme-script.tsx`
  intentionally ignores `prefers-color-scheme` — first-time visitors always get
  dark. Light is opt-in via the nav toggle (persisted in localStorage).
- **Sections** are server components (only `useTranslations`). Interactive bits
  (`nav`, `theme-toggle`, `locale-switcher`, `chat-widget`, `contact`) are
  `'use client'`.
- **Project data** lives in `data/projects.ts`; copy/tags/status in
  `messages/*.json` under `projects.pN.*`. The "Paid Funnels" project stays a
  single enriched card (do not split it).
- **The chatbot knowledge base** is `data/miguel-context.ts`. To change what the
  bot knows, edit that file — there is no vector store, the whole context is
  injected into the system prompt (RAG-light).

## Product rules

- The contact email is **never rendered in the UI** and there is **no `mailto:`
  fallback** (anti-scraping). Contact is only via the form, LinkedIn, or Cal.com.
- Contact form: name/email/message required, phone optional. Inline per-field
  validation with red message; server-side validation repeated in
  `app/api/contact/route.ts`.
- `migueldacal.com` (apex) 307-redirects to `www.migueldacal.com` (Vercel config).

## Gotchas (avoid these mistakes)

- Next.js 16: it's `proxy.ts`, not `middleware.ts`.
- Tailwind v4: theme tokens go in `@theme inline` in CSS, not in a config file.
- Cal.com is the **EU instance**: `embedJsUrl: 'https://app.cal.eu/embed/embed.js'`
  and `data-cal-origin="https://cal.eu"`.
- Image filenames must be lowercase (Vercel/Linux is case-sensitive).
- Code pasted into n8n Code nodes: single quotes only, no double quotes inside
  strings (the n8n editor breaks multi-line strings → SyntaxError).

## Environment

See `.env.example` for required variables (no values committed):
- `OPENAI_API_KEY` — chat widget
- `N8N_CONTACT_WEBHOOK_URL`, `N8N_CONTACT_SECRET` — contact form forwarding

`.env.local` is gitignored. **Never paste secrets into `.env.example`** — it is
committed to the public repo. Secrets go in `.env.local` only.
