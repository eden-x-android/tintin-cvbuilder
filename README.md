# Tintin CV Builder

Repo: `eden-x-android/tintin-cvbuilder` (local folder: `tintin-cvbuilder-edenx`).

CV builder: import JSON → edit in a form → live A4 preview → print / save as PDF → export JSON.
Three CV templates (P1a / P1c / P1d) ported pixel-accurately from the design export; the app UI uses HeroUI v3 + Tailwind v4.

## Features

- **Templates:** pick P1a (Cobalt · Manrope), P1c (Ink · Archivo) or P1d (Forest · Cormorant) from the sticky header.
- **Form editor:** every section is editable; list items can be added, removed and reordered.
- **Month / year pickers** for job and education dates (popover on desktop, bottom sheet on mobile), with an "I currently work here" switch.
- **Project metadata** as free key-value pairs (e.g. `SDLC: Agile/Scrum`), printed as one line under the project name.
- **Links in text:** select text in a long field, press 🔗, paste a URL.
- **Page breaks:** "Start on a new page" per section and "Page break after this item" per job / project. The preview marks them.
- Sections and the photo only appear on the CV when they have content.
- Draft auto-saved in the browser (localStorage). Still export JSON to keep a real copy.
- Login gate: username + one-time code by email (Netlify Edge Function + Resend).

## Running locally

```bash
npm install
npm run dev            # Vite only, no login gate — open http://localhost:5173
npm run dev:netlify    # with the login gate + /api/* (needs .env, see .env.example) — http://localhost:8888
```

Other scripts: `npm run build` (app + login page), `npm run typecheck`, `npm run lint`.
Node 22 is used on Netlify and CI (Vite 7 needs Node >= 20.19).

## Data format (`src/types/cv.ts`)

- `experience[]`: `startDate` / `endDate` as `"YYYY-MM"`; `endDate` may be `"present"`. Printed as `June 2024 – Present`.
- `projects[]` is its own section; details live in `meta: [{ "key": "SDLC", "value": "Agile/Scrum" }]`.
- `education[]`: `startYear` / `endYear` as `"YYYY"`.
- Long text may contain links as `[text](https://...)`.
- Page breaks: `sectionBreaks` (start a section on a new page) and `pageBreakAfter` on each job / project.
- `personal.photo`: optional data URL of the profile photo.
- Import validates the file and lists errors by field path. Export writes exactly this schema (no internal ids).

## Printing

Click **In / PDF**, choose "Save as PDF", paper A4, margins "None".
Red dashed lines in the preview estimate page ends; black lines are forced page breaks (exact when printed).

## CI / CD

| Step | Where | Trigger |
|---|---|---|
| **CI** — typecheck, lint, build | GitHub Actions (`.github/workflows/ci.yml`) | every pull request and every push to `master` |
| **CD** — build + deploy to production | Netlify Git integration (`netlify.toml`) | every push to `master` |

Netlify builds deploy previews for pull requests too (behind the same login gate).

### One-time Netlify setup

1. **Resend** — sign up at [resend.com](https://resend.com) with the email that should receive login codes
   (without a verified domain, Resend only delivers to the account owner's address). Create an API key.
2. **Netlify** — *Add new site → Import an existing project → GitHub* → pick `eden-x-android/tintin-cvbuilder`.
   Production branch: `master`. Build settings come from `netlify.toml` — leave the form fields as detected.
   (If the repo is not listed, grant the Netlify GitHub app access to it under *Configure the Netlify app on GitHub*.)
3. **Environment variables** — *Site configuration → Environment variables*, scope **All** (functions and edge functions need them):

   | Variable | Value |
   |---|---|
   | `AUTH_USERNAME` | Username typed on the login page |
   | `AUTH_EMAIL` | Inbox that receives the login code |
   | `RESEND_API_KEY` | Resend API key (mark as secret) |
   | `RESEND_FROM` | Sender, e.g. `Tintin CV Builder <onboarding@resend.dev>` |
   | `SESSION_SECRET` | Random string: `openssl rand -hex 32` (mark as secret) |

4. **Deploy** — *Deploys → Trigger deploy*, or push to `master`. Changing env vars needs a redeploy.

### Free-tier notes

- Netlify Free: 300 build minutes / month; one build takes about 1 minute.
- GitHub Actions on a private repo: 2,000 minutes / month on the free plan; one CI run takes 1–2 minutes.
- Resend Free: 100 emails / day. Login codes have a 60-second resend cooldown.

## How the login works

- `netlify/edge-functions/auth-gate.js` runs on every request. Without a valid `cv_session` cookie, page loads redirect to `/login/`
  and everything else returns 401 — including the app bundle in `/assets/`.
- The login page is a separate small Vite bundle served from `/login/` (`vite.login.config.ts`), which the gate lets through.
- `POST /api/request-otp` emails a 6-digit code (valid 5 minutes); `POST /api/verify-otp` checks it (5 attempts) and sets an
  HttpOnly session cookie valid for 7 days. `/api/logout` clears it. Rotating `SESSION_SECRET` signs everyone out.

## For coding agents

Read `AGENTS.md` first (Claude Code loads it through `CLAUDE.md`).
