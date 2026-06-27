# CLAUDE.md

Guidance for **Claude Code** (Cursor extension) and AI assistants working in this repo.

## Project Overview

Portfolio website for Pablo Pinxit (Pablo Compagnucci). **Astro 6 SSR** + **Node standalone** in **Docker**, deployed on **Dokploy** (deploy.dgzconsulting.com). Production: https://pablopinxit.com

**Continuity doc:** `docs/HANDOFF-galeria-walls-2025-06-26.md` — gallery work, CRM conventions, deploy state.

## Commands

```bash
npm run dev       # Dev server → localhost:4321
npm run build     # Production build (@astrojs/node)
npm run start     # node ./dist/server/entry.mjs
npm run preview   # Preview build
```

Run from **`pablopinxit-sito/`** (not repo parent). Docker: `docs/DOKPLOY.md`

No test runner or linter configured.

## Deploy (Dokploy)

- GitHub: `DGZ-Consulting/pablopinxit-sito` branch `main`
- Dockerfile at repo root, port **4321**, `HOST=0.0.0.0`
- Env: `CRM_URL`, `CRM_SITE_SLUG`, `HOST`, `PORT`
- **Not Vercel** — `@vercel/analytics` removed

## Architecture

### SSR

`output: 'server'`, adapter `@astrojs/node` `{ mode: 'standalone' }` in `astro.config.mjs`.

### CRM data flow

- `src/lib/crm.ts` → `GET {CRM_URL}/api/sites/{CRM_SITE_SLUG}/portfolio`
- Used by Layout (nav), `[category].astro`, sitemaps
- Shape: categories with `items[]` (`title`, `image_url`, `sort_order`, `description`)
- Empty array if API down

### Gallery system (important — Jun 2025)

**Files:** `src/components/GalleryGrid.jsx`, `src/lib/galleryGroups.ts`

- **LOCATION filter:** groups by title prefix before first ` · `
- **Walk order:** CRM titles use hidden index `Mural · 1 · detail` — number stripped in UI via `formatDisplayTitle()`
- **All view:** clusters by location, sorts within group
- **Filtered view:** 2-col row grid when group has walk sequence
- **Legacy fallback:** `GROUP_WALK_ORDER` map for `8 donne straordinarie Milano`
- Filter shown when 2–50 location groups

CRM cannot reorder via UI yet — client uses ` · N · ` in titles. Phase 2: Filament drag-drop in `dgz-crm-portal`.

### Routing

- `/` — CRM categories + static tiles
- `/[category]` — dynamic galleries (excludes `videos`, `arts-books`)
- `/about`, `/contact`, `/videos`, `/arts-books` — static
- `/sitemap-pages.xml`, `/sitemap-images.xml`

### Other

- React: `GalleryGrid.jsx`, `Navigation.jsx` (`client:load`)
- GSAP: nav animation — `docs/gsap-menu-reference.md`
- SEO: `src/lib/seo.ts`
- Tailwind v4 via Vite plugin

## Environment Variables

| Var | Purpose |
|-----|---------|
| `CRM_URL` | CRM API base (required) |
| `CRM_SITE_SLUG` | Default `pablopinxit` |
| `HOST` | `0.0.0.0` in Docker |
| `PORT` | `4321` default |

## Styling

- Headings: Poiret One (`.font-heading`)
- Nav styles: `src/styles/global.css` (`pp-nav-*`, `pp-menu-*`)
