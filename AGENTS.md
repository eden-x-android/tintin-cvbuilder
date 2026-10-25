# AGENTS.md — tintin-cvbuilder-edenx

> Entry point for AI coding agents (Antigravity, Claude Code, Cursor, etc.).
> Detailed rules live in separate files under `.agents/rules/` and are
> referenced below using `@filename` so agents can pull them into context
> only when relevant.

---

## How to use this file

1. Read this file first in every session.
2. Treat anything under **Hard Rules** as non-negotiable, regardless of
   which topic file is loaded.
3. Before starting a task, check the **Rule File Index** below and load the
   file(s) whose trigger matches the task. Load more than one file if the
   task spans categories.
4. If a rule conflicts with a user instruction, follow the rule and explain
   why — unless the rule itself says to stop and ask first.

---

## Project Goals

- Keep Netlify (Hosting, Functions, Edge Functions, Blobs) and Resend on
  their free tiers — never trigger billing without explicit user
  confirmation.
- Keep the codebase a small, single-purpose CV builder (import JSON → form
  edit → live preview → print/export), not a general app framework — avoid
  routing, state libraries or a backend beyond the login gate.
- Render the 3 CV templates (P1a / P1c / P1d) pixel-faithful to the design
  export in `asset/`, with the exact same fonts, and print-accurate on A4.
- One typed schema (`CvData`) shared by import validation, form, and
  templates; exported JSON always matches that schema exactly.

---

## Project Snapshot

- **Stack:** React 19 + Vite 7 + TypeScript (strict), plain CSS (no
  CSS-in-JS/Tailwind), ESLint 9. Netlify functions stay plain JS.
- **Architecture:** Single-page app, prop-drilled state — `App.tsx` owns
  `CvData` via `useState`, passes it to `CvForm` (editor) and `CvPreview`
  (A4 template). Pure helpers in `src/utils/` build the template view-model.
- **Data layer:** No backend/database — CV data lives in client state; JSON
  import/export is the only persistence. Avatar stored as data URL in JSON.
- **UI style:** Neobrutalism copied from repo `auto-content`
  (`web/src/app/globals.css`); CV pages follow the design export instead —
  see `@.agents/rules/css-conventions.md`.
- **Hosting & auth:** Netlify, auto-deployed from `master`. Login gate
  (edge function + OTP via Resend + Blobs) ported from repo `cv-by-html`.
  See `@.agents/rules/netlify-cost-safety.md`.
- **Status:** rules only — app not scaffolded yet.

---

## Hard Rules (always apply)

- Never enable/upgrade any billable Netlify, Resend or other cloud service,
  or touch billing/payment settings, without explicit user confirmation first.
- Deploys happen by pushing to `master` — only push/merge there when the
  user asks. New features in `netlify.toml` require confirmation.
- Never weaken the auth gate (excluded paths, cookie checks, OTP limits)
  without explicit user confirmation.
- `asset/*.html` are read-only design sources — never edit or serve them.
- When replying in Vietnamese, the agent refers to itself as "em" and
  addresses the user as "đại ca".

(Full detail: `@.agents/rules/netlify-cost-safety.md`, `@.agents/rules/cv-templates.md`, `@.agents/rules/PRONOUNS.md`)

---

## Rule File Index

| File | Load when... |
|---|---|
| `@.agents/rules/css-conventions.md` | Writing or editing CSS: class naming, UI-app vs CV-template variables, units (`rem` for app, exact `px` for CV pages), inline style vs class, fonts, print styles. |
| `@.agents/rules/cv-templates.md` | Touching `AtsTemplate`, `presets.ts`, `buildCvView`, fonts in `public/fonts/`, or reading/extracting anything from `asset/*.html`. |
| `@.agents/rules/file-organization.md` | Adding/moving files or folders, creating a new component/util/type, deciding where a CSS/asset/font file belongs. |
| `@.agents/rules/netlify-cost-safety.md` | Any task touching `netlify.toml`, `netlify/`, `public/login/`, deploys, billing/plan changes, email sending, or adding a new cloud service. |
| `@.agents/rules/PRONOUNS.md` | Any reply written in Vietnamese — governs self-reference ("em") and how the user is addressed ("đại ca"). |
| `@.agents/rules/react-conventions.md` | Writing or editing React/TS code: typing `CvData` and props, component declaration, nested state updates, internal ids/keys, handler naming, JSX patterns. |
