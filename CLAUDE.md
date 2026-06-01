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
    layout.tsx          # html shell, fonts, ThemeScript, CalInit (global chrome)
    opengraph-image.tsx # dynamic OG image per locale
    (site)/             # route group for the marketing site
      layout.tsx        # adds Nav + ChatWidget
      page.tsx          # composes the home sections
    p/[token]/
      page.tsx          # personalized presentation page (video + CTA), noindex
  api/
    chat/route.ts       # chat widget endpoint (OpenAI stream)
    contact/route.ts    # contact form -> signed forward to n8n webhook
    track/route.ts      # presentation video events -> signed forward to n8n (separate webhook)
  sitemap.ts, robots.ts, globals.css
components/
  nav.tsx, theme-script.tsx, theme-toggle.tsx, locale-switcher.tsx
  cal-init.tsx, cal-button.tsx, chat-widget.tsx
  video-presentation.tsx # YouTube IFrame API + view tracking (client)
data/
  projects.ts           # project metadata (ids, thumbs)
  prospects.ts           # parse/lookup for /p/[token]; DATA lives in env (private)
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

## Presentation pages (outreach video tracking)

- `/p/[token]` serves a personalized video presentation to a single company.
  Tokens are **opaque and non-guessable**. The token -> `{company, contact?}`
  map is **private**: it lives in the `PRESENTATION_PROSPECTS` env var (JSON),
  NOT in the repo, so target companies/tokens never go public. `data/prospects.ts`
  only parses + looks it up. Unknown/removed token -> 404. To revoke/add a
  company, edit the env var and redeploy.
- The page greets by `contact` (first name) when present, else by `company`
  team. It lives **outside** the `(site)` group so it has no portfolio nav.
- The video is `NEXT_PUBLIC_PRESENTATION_VIDEO_ID` (a YouTube ID). Empty -> the
  page shows an "unavailable" message instead of the player (no code change to
  pull a video). The YouTube video must be **Unlisted**, not Private (private
  can't be embedded). Removing it from the page does NOT remove it from YouTube.
- View events (`open`, `play`, `progress_25/50/75`, `complete`, `close`) are
  reported by `video-presentation.tsx` to `/api/track`, which validates the
  token and HMAC-signs a forward to a **separate** n8n webhook
  (`N8N_TRACK_*`). Never reuse the contact webhook for this.
- This is GA4-free by design: the token in the URL identifies the company
  server-side, so no cookies/consent banner are needed for the tracking.

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
- `N8N_TRACK_WEBHOOK_URL`, `N8N_TRACK_SECRET` — presentation video tracking
  (separate n8n workflow from contact)
- `NEXT_PUBLIC_PRESENTATION_VIDEO_ID` — YouTube ID for `/p/[token]` (public)
- `PRESENTATION_PROSPECTS` — private JSON token->company map (server-only)

`.env.local` is gitignored. **Never paste secrets into `.env.example`** — it is
committed to the public repo. Secrets go in `.env.local` only.
