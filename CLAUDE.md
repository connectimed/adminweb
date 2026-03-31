# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Next.js)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

There are no test commands configured.

## Architecture

**Next.js 15 App Router** admin dashboard for the IMEDConnect platform (educational mentorship/examination system). All pages use `"use client"` — this is a client-side-heavy app backed by Firebase.

### Route Groups

- `app/(auth)/` — Unauthenticated routes (sign-in). No topbar layout.
- `app/(root)/` — Protected routes requiring Firebase auth + `user_type === "Admin"`. Wraps content in `Topbar`.

### Authentication & Authorization

`lib/AuthContext.js` provides a React Context (`UserAuth()` hook) that:
- Listens to `onAuthStateChanged` and fetches user data from Firestore `Users` collection
- Redirects unauthenticated users to `/sign-in`
- Wraps the entire app in `app/layout.js`

All protected pages check `userData.user_type === "Admin"` and render `<UnAuthorized />` for non-admin users.

Login uses phone-derived emails: phone `0712345678` → email `255712345678@gmail.com` (Tanzania +255 prefix).

### Firebase

Initialized in `lib/firebase.js`, exports `db` (Firestore), `auth`, and `storage`.

**Known Firestore collections:**
- `Users` — user profiles with `user_type` ("Admin", "Mentor", "Student"), `user_image`, `user_sex`
- `Modules` — educational modules
- `Public` / `Private` — media content records
- `System` — app config (e.g., `general` doc with upload counters)

`lib/functions.js` handles media uploads to Firebase Storage (`public/` and `private/` paths) and Firestore record creation, including auto-incrementing ID counters from `System/general`.

### Dashboard Panels

The home page (`app/(root)/page.jsx`) renders four panel components:
- `UsersPanel`, `ModulesPanel`, `ApplicationsPanel`, `ExaminationsPanel`

All panels use Firestore queries with `where()` filtering and support Excel export via the `xlsx` library.

### Styling

Tailwind CSS v4 via PostCSS. Custom theme variables in `app/globals.css`:
- `--color-primary`: `#ff017d` (pink, used for primary actions)
- `--color-dark-bg`, `--color-deep-dark`, `--color-accent`
- Utility classes: `.btn`, `.btn-primary`, `.text_input`

Path alias `@/*` resolves to the project root (configured in `jsconfig.json`).

### Environment

Firebase client config uses `NEXT_PUBLIC_FIREBASE_*` variables. Server-side Firebase Admin uses `FIREBASE_*` variables. ZegoCloud video service uses `NEXT_PUBLIC_ZEGOCLOUD_*`. All stored in `.env.local`.

Next.js image domains: Firebase Storage (`firebasestorage.googleapis.com`) is allowlisted in `next.config.mjs`.
