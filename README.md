# Siddartho Sarker Bipro — Portfolio

Personal portfolio built with Next.js 15, React 19, and TypeScript, deployed on Vercel at [siddartho.vercel.app](https://siddartho.vercel.app).

## Highlights

- **3D background with per-section camera choreography** — a colorless, depth-y starfield (700 points on desktop, 320 on small screens, single draw call) rendered with react-three-fiber. Every page section has its own camera "shot" (depth, FOV, look-at drift, tuned in the `SECTION_SHOTS` table) scrubbed continuously by GSAP ScrollTrigger against the Lenis smooth-scroll source, with capped pointer parallax and slow idle field drift layered on top. See `src/components/BackgroundScene.tsx`, `src/lib/scrollStore.ts`, and `src/components/layout/SmoothScrollProvider.tsx`.
- **"Space journey" landmarks** — section-scoped 3D objects positioned outside the content column: wireframe forms for `#projects` (node-graph) and `#skills` (crystal) in `src/components/SectionForms.tsx`, plus four landmarks — a planet with atmosphere ring (`#about`), a star cluster (`#experience`), a tumbling debris field (`#blog`), and an arrival portal (`#contact`) — in `src/components/SpaceLandmarks.tsx`, all sharing one accent palette and scrubbed to their own section's scroll range. A shared projection helper (`src/lib/threeProjection.ts`) keeps object-vs-content clearance measurable and verified.
- **Smooth scrolling** — Lenis smooth scroll wired to GSAP's ticker and ScrollTrigger as the single scroll source, publishing into a shared scroll store (`src/lib/scrollStore.ts`) that the navbar and scene read from, with a native-scroll fallback under `prefers-reduced-motion`. The reduced-motion convention is consistent everywhere: fixed camera, no landmarks/forms, no carousel drag or auto-advance.
- **Coverflow project carousel** — the landing page's projects section shows the featured project in its own panel and rotates every other project through a depth-stack carousel (drag/swipe, auto-advance, prev/next arrows, keyboard navigation, position indicator). See `src/components/projects/ProjectCarousel.tsx` and `src/components/projects/ProjectGrid.tsx`. An archive page at `/projects` lists every project — including future/upcoming ones, which render visually distinct via the optional `stage` field on `Project` (`src/types/index.ts`, handled in `src/components/projects/ProjectCard.tsx`).
- **Self-managed content** — an auth-gated `/dashboard` (Firebase Auth + Firestore) with a single, schema-driven `CollectionManager` component powering CRUD for Skills, Projects, Experience, and Blog posts, plus an analytics view (Recharts) and a contact-message inbox. See `src/app/dashboard` and `src/components/cms`.
- **Live blog** — the homepage Blog section, the `/blog` listing, and `/blog/[slug]` detail pages all read Firestore live via `onSnapshot` (`src/hooks/useBlogPosts.ts`), so posts published from the dashboard appear without a redeploy. Falls back gracefully (quiet empty state) when Firebase isn't configured.
- **Custom project illustrations** — per-project SVG/icon compositions built from `lucide-react`, no stock imagery. See `src/components/projects/ProjectIllustration.tsx`.
- **Design-token driven theming** — a full CSS-variable system (`src/app/globals.css`) for color, type, and spacing, no hardcoded values in components.

## Tech stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, custom CSS-variable design tokens
- **3D / animation:** three.js + @react-three/fiber + @react-three/drei, GSAP (ScrollTrigger), Lenis smooth scroll, Framer Motion
- **Backend:** Firebase Auth, Firestore (client SDK only)
- **Icons:** lucide-react
- **Charts:** Recharts
- **Fonts:** Geist and Space Grotesk via `next/font`

## Project structure

```
src/
  app/           Routes — home, /projects, /projects/[slug], /blog, /blog/[slug],
                 auth-gated /dashboard (analytics, messages, projects, blogs,
                 skills, experience), /login
  components/    Feature-organized: background (3D scene, landmarks, forms),
                 hero, about, experience, projects, skills, blog, contact,
                 cms, layout, ui, seo
  data/          Static content — projects, skills, contact, socials
  hooks/         useBlogPosts, useMagneticButtons, useScrollReveal
  lib/           Shared utilities, motion config, scroll store, three projection
  types/         Shared TypeScript types
```

## Running locally

```bash
npm install
cp .env.example .env.local   # add your own Firebase project credentials
npm run dev
```

Firebase env vars accept either the `REACT_APP_FIREBASE_*` or `NEXT_PUBLIC_FIREBASE_*` prefix (both are mapped in `next.config.ts`). Requires a Firebase project (Auth + Firestore enabled) for the `/dashboard` routes and blog to work; the public site renders without it.

## Deployment

Deployed on Vercel, auto-building from the `main` branch.
