# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio website for Pablo Pinxit (Pablo Compagnucci), an Argentine-Italian visual artist. Built with Astro 6 in SSR mode, deployed via **Docker / Dokploy** (self-hosted).

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build (SSR via @astrojs/node)
npm run start     # Run production server (after build)
npm run preview   # Preview production build locally
```

Docker: see `docs/DOKPLOY.md`

No test runner or linter is configured.

## Architecture

### Rendering Mode

Full SSR (`output: 'server'` in astro.config.mjs). All pages are server-rendered on Vercel, including dynamic gallery routes.

### Data Flow: CRM Integration

Portfolio data comes from an external CRM API, not from local files or a CMS:

- `src/lib/crm.ts` fetches categories and items from `CRM_URL` + `CRM_SITE_SLUG` env vars at request time
- Every page that shows galleries/navigation calls `getCrmPortfolio()` (including the Layout, which builds nav from it)
- If `CRM_URL` is unset or the API is down, `getCrmPortfolio()` returns `[]` gracefully — the site renders with no gallery content
- CRM data shape: `PortfolioCategory[]` with `name`, `slug`, `cover_image`, `description`, and `items[]` (each with `title`, `image_url`, `sort_order`)

### Routing

- `/` — homepage grid of CRM categories + static tiles (Videos, Arts Books, About, Contact)
- `/[category]` — dynamic SSR route for CRM-sourced gallery categories. Excludes slugs in `STATIC_CATEGORY_ROUTES` (`videos`, `arts-books`) which have their own pages
- `/about`, `/contact`, `/videos`, `/arts-books` — static Astro pages
- `/sitemap-pages.xml`, `/sitemap-images.xml` — custom API routes generating XML sitemaps from CRM data

### Key Libraries

- **React** (via `@astrojs/react`): used only for two interactive client-side components — `GalleryGrid.jsx` and `Navigation.jsx`. Both use `client:load`.
- **GSAP 3.15+**: powers the navigation menu animation (interruptible enter/exit timeline with `addPause()` and `easeReverse`). Dynamically imported inside `Navigation.jsx`. See `docs/gsap-menu-reference.md` for the animation pattern reference.
- **Tailwind CSS v4**: configured as a Vite plugin (`@tailwindcss/vite`), imported in `src/styles/global.css`.

### Layout & SEO

`src/layouts/Layout.astro` is the single layout wrapper. It:
- Fetches CRM portfolio to build navigation categories
- Accepts SEO props (`title`, `description`, `image`, `jsonLd`, `keywords`, `noindex`)
- Renders Open Graph, Twitter Card, canonical URL, and JSON-LD structured data

`src/lib/seo.ts` centralizes all SEO logic: site constants (`SITE`), per-category SEO overrides (`CATEGORY_SEO`), JSON-LD builders, sitemap XML generation, and image alt text generation.

### Gallery System

`GalleryGrid.jsx` handles: masonry layout (CSS columns), progressive loading (IntersectionObserver with PAGE_SIZE=15), lightbox with keyboard navigation, and location-based filtering.

`src/lib/galleryGroups.ts` extracts location groups from CRM image titles using pattern matching against known Italian location prefixes (Milano streets, murals, etc.). This grouping drives the filter dropdown on gallery pages.

### Navigation

Single GSAP-animated fullscreen overlay menu for all breakpoints (no separate desktop nav). The hamburger icon morphs to X via SVG `attr` animation. Categories are injected from CRM data. See `docs/gsap-menu-reference.md` for the interruptible timeline pattern.

### Styling Conventions

- Font: "Poiret One" for headings (`.font-heading`), system sans-serif for body
- Color scheme: white background, `#1a1a1a` text, `#800000` accent on hover (About/Contact tiles)
- Navigation component styles live in `src/styles/global.css` (prefixed `pp-nav-*`, `pp-menu-*`)
- Page-specific styles use Astro scoped `<style>` blocks

## Environment Variables

- `CRM_URL` — base URL of the external CRM API (required for gallery content)
- `CRM_SITE_SLUG` — site identifier for the CRM API (defaults to `pablopinxit`)
