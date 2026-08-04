# Siddartho Sarker Bipro — Portfolio

Personal portfolio built with Next.js 15, React 19, and TypeScript, deployed on Vercel at [siddartho.vercel.app](https://siddartho.vercel.app).

## Highlights

- **Self-managed content** — an auth-gated `/dashboard` (Firebase Auth + Firestore) with a single, schema-driven `CollectionManager` component powering CRUD for Skills, Projects, and Experience, plus a lightweight analytics view and a contact-message inbox. See `src/app/dashboard` and `src/components/cms`.
- **Custom project illustrations** — per-project SVG/icon compositions built from `lucide-react`, no stock imagery. See `src/components/projects/ProjectIllustration.tsx`.
- **Design-token driven theming** — a full CSS-variable system (`src/app/globals.css`) for color, type, and spacing, no hardcoded values in components.

## Tech stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, custom CSS-variable design tokens
- **Backend:** Firebase Auth, Firestore
- **Animation:** Framer Motion
- **Icons:** lucide-react
- **Charts:** Recharts

## Project structure

src/
app/ Routes — home, project detail pages, auth-gated dashboard
components/ Feature-organized: hero, projects, experience, skills, cms, layout, ui
data/ Static content — projects, skills, contact, socials
lib/ Shared utilities and motion config
types/ Shared TypeScript types


## Running locally

```bash
npm install
cp .env.example .env.local   # add your own Firebase project credentials
npm run dev
```

Requires a Firebase project (Auth + Firestore enabled) for the `/dashboard` routes to work; the public site renders without it.

## Deployment

Deployed on Vercel, auto-building from the `main` branch.
