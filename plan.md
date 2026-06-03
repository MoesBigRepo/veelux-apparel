# Veelux Apparel — Extract, Fix, SEO, Redesign, Animate

## Context

`veeluxapparel.com` is a **live Shopify store** (confirmed: `cdn.shopify`, `myshopify`) for a
luxury rhinestone streetwear brand. ~39 URLs total: 11 products, 13 collections, pages
(about-us, contact, policies), 1 blog. Tagline: *"All Eyes on You — Limited Drops Available!"*

Goal: extract everything, fix bugs, maximize SEO, and rebuild it **beautiful** —
benchmarked against luxury streetwear peers — as a **standalone React + Vite site** in a new
project folder. All original copy/images/creative preserved. Add Framer Motion UI motion and a
Seedance 2.0 hero brand video (generated via the higgsfield CLI).

Cannot push to their live Shopify (no admin/theme access), so deliverable is a self-controlled
rebuild we can ship to Vercel/Pages — Shopify untouched. Decisions confirmed with operator:
**standalone rebuild · React+Vite · luxury streetwear benchmark cohort.**

Tooling verified present: `firecrawl` v1.16 (auth ok, 1,641 credits), `higgsfield` CLI (auth TBD,
`seedance_2_0` model confirmed in `model list --video`), `seo-core` skill (canonical SEO entry).

## Project location

New folder: `~/projects/veelux-apparel/` (lowercase, per repo-path convention).
First two files written: `plan.md` + `CLAUDE.md` (per-project rule), then scaffold.
Raw extraction cached under `~/projects/veelux-apparel/.firecrawl/` (gitignored).

---

## Phase 1 — Extract (firecrawl)

1. `firecrawl crawl "https://veeluxapparel.com/"` → markdown for all 39 URLs into `.firecrawl/`.
2. Per-product structured pull (11 products): `firecrawl scrape --format json` with a schema
   capturing `title, price, compareAtPrice, description, variants, options, images[], sku`.
   Save `data/products.json` — the content source of truth for the rebuild.
3. Collections → `data/collections.json` (handle, title, product handles, hero copy).
4. Pages (about-us, contact, refund/shipping policies, blog) → `content/*.md`.
5. `firecrawl download` (or curl over the scraped CDN image URLs) → `public/assets/products/…`,
   `public/assets/brand/…`. Keep originals; generate `.webp` derivatives in Phase 4.
6. Record the brand's logo, fonts (from theme CSS), and color tokens for fidelity.

## Phase 2 — Bug audit & fix list

Catalog from the scrape + a live QA pass (`browser-qa` / `web-performance-audit` skills):
- **Broken country/currency selector** — every locale link resolves to `/#` (200+ dead links). Real bug.
- Hero image `alt="index"` (non-descriptive); audit all alt text.
- Duplicate marquee nodes (10× repeated DOM) — collapse to one CSS marquee.
- Public `/agents.md` exposure — exclude from rebuild.
- Console errors, 404 assets, mobile layout breaks, tap-target sizing, CLS offenders.
Output: `docs/bug-audit.md` with severity + fix mapped to the new build (bugs are fixed by
correct reimplementation, not patched on Shopify).

## Phase 3 — SEO (deterministic: `seo-core`)

`seo-core` is the canonical entry skill ("orchestration of specialized SEO sub-skills"). Run a
full audit, then implement in the rebuild:
- Unique `<title>` + meta description per product/collection/page (keyword-mapped).
- **Product JSON-LD** (`schema-markup` sub-skill): Product, Offer, AggregateRating, Breadcrumb;
  Organization + WebSite on home.
- Semantic heading hierarchy, descriptive alt text on every image, internal-link mesh.
- `sitemap.xml`, `robots.txt`, canonical tags, OG/Twitter cards (+ `og-image` per product).
- Core Web Vitals: image `srcset`/lazy-load, font preload+subset, code-split routes.
Output: `docs/seo-report.md` (before/after checklist).

## Phase 4 — Competitive design study + redesign

Benchmark cohort (operator-approved): **Represent, Fear of God Essentials, Aimé Leon Dore,
Rhude, Gallery Dept.**
1. `firecrawl scrape` each → extract design-system signals: type scale, grid system, color/dark-luxe
   palette, PDP layout, nav pattern, whitespace rhythm, motion cues. → `docs/design-study.md`.
2. Synthesize a Veelux design system (`design-system` skill): tokens (color/type/space), components.
   **Keep all Veelux copy, images, products, brand identity** — apply *layout/typography/spacing*
   patterns only (per "derive only from sources" — Veelux content stays Veelux).
3. Rebuild as **React + Vite + TypeScript + Tailwind**:
   - Routes: Home, Collections index, Collection, PDP, About, Contact, Policies, Blog.
   - Editorial dark-luxe hero, refined product grid, elevated PDP (sticky gallery + variant
     selector), polished footer. Real cart deferred (static rebuild) — "Shop"/"Add" CTAs link to
     the live Shopify product URL so checkout still works, OR a Shopify Buy-Button embed (decide
     in build; default = link out to keep checkout functional).
   - Responsive, accessible (WCAG AA), Lighthouse 90+ target.

## Phase 5 — Motion (Framer Motion) + Seedance 2.0 video

- **Framer Motion** (hand-coded, `motion` skill): scroll-reveal sections, hero parallax, PDP image
  gallery transitions, staggered product-grid entrance, page transitions, nav micro-interactions.
- **Seedance 2.0 hero video** via higgsfield CLI (`higgsfield-generate` skill):
  - `higgsfield auth` check first; if not authed, surface as blocker.
  - Generate a short looping brand film from the hero product imagery
    (`higgsfield generate create seedance_2_0 --prompt "…" --image <upload_id>`), poll to done,
    download mp4 → `public/assets/brand/hero.mp4`.
  - Place where deterministically best = **homepage hero background** (muted, autoplay, loop,
    `poster` fallback, `prefers-reduced-motion` respected), revealed/scaled via Framer Motion.
    Lazy-load; never block LCP (poster image is the LCP element).

## Phase 6 — Verify & ship (no auto-ship)

- `pnpm build` clean; `pnpm preview` + Playwright/`browser-qa` smoke on all routes.
- Lighthouse (perf/SEO/a11y/best-practices) — report in `docs/`.
- Validate JSON-LD (schema validator), check no dead links, mobile + desktop screenshots.
- **Stop before deploy.** Present build + reports. Ship to Vercel/GitHub Pages only on explicit
  approval (per no-auto-ship rule).

---

## Critical files / outputs
- `~/projects/veelux-apparel/{plan.md,CLAUDE.md}` — written first.
- `data/products.json`, `data/collections.json`, `content/*.md` — extracted source of truth.
- `public/assets/**` — all original images + `hero.mp4` (Seedance).
- `src/` — React+Vite app (routes, components, design-system tokens, Framer Motion).
- `docs/{bug-audit,seo-report,design-study}.md` — deliverable reports.

## Reused tooling (don't reinvent)
- Extraction: `firecrawl` CLI (crawl/scrape/download).
- SEO: `seo-core` (+ `schema-markup` sub-skill).
- Design: `design-system`, `frontend-design` skills; `motion` for Framer Motion.
- Video: `higgsfield-generate` skill + higgsfield CLI `seedance_2_0`.
- QA: `web-performance-audit`, `browser-qa`.
- Ship (on approval): Vercel, or single-repo GitHub Pages flow.

## Open blockers to surface during execution
- higgsfield CLI auth/credits (`higgsfield account`) — needed for Seedance. If unauthed, pause.
- Cart/checkout: default to linking out to live Shopify product pages (keeps checkout real) unless
  operator wants a Shopify Buy-Button embed.

## Verification
- All 11 products + 13 collections render with original copy/images.
- Country selector + alt-text + marquee bugs gone; `docs/bug-audit.md` items all closed.
- JSON-LD validates; sitemap/robots/canonical/OG present; Lighthouse SEO ≥ 95.
- Framer Motion interactions smooth at 60fps; Seedance hero video loops, respects reduced-motion,
  doesn't regress LCP.
- `pnpm build` + preview clean across all routes, mobile + desktop.
