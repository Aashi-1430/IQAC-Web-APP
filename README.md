# SVIET IQAC Portal — Next.js/React

This is a React + Next.js (App Router) conversion of the original static
HTML/CSS/JS IQAC portal. It talks to the same backend API
(`https://fms-backend-ybbn.onrender.com`) and preserves the original design.

## What changed vs the original

- Vanilla DOM manipulation → React components + hooks
- Global `script.js` → `lib/api.js` (fetch/parsing helpers) and
  `lib/AuthContext.js` (auth state, login/signup/logout, session restore)
- Single `index.html` with hidden/shown sections → real Next.js routes:
  - `/` — login & signup
  - `/iqac-coordinator/home` (+ user-management, departments, forms, audits,
    notifications) — IQAC Coordinator dashboard, protected by role
  - `/hod/home` — HOD dashboard, protected by role
- `style.css` copied as-is into `app/globals.css` (same class names, so all
  original styling is preserved)
- `alert()`-based profile view replaced with a small modal for a better UX

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Build for production

```bash
npm run build
npm start
```

## Project structure

```
app/                       Next.js App Router pages
  page.js                  Login/signup entry point
  iqac-coordinator/        Coordinator dashboard + protected layout
  hod/                     HOD dashboard + protected layout
  layout.js                Root layout (fonts, AuthProvider)
  globals.css              Ported styles (from style.css)
components/                React components (forms, header, sidebar, modals)
lib/
  api.js                   Fetch helpers ported from script.js
  AuthContext.js            Auth state/session management (React context)
```
