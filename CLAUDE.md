# Veelux Apparel — Rebuild

Standalone React + Vite + TS + Tailwind v4 rebuild of `veeluxapparel.com` (live Shopify store,
luxury rhinestone streetwear). We do NOT control their Shopify — this is a self-controlled rebuild
preserving all original copy/images/creative, fixing bugs, maximizing SEO, redesigned against
luxury streetwear peers, with Framer Motion + a Seedance 2.0 hero video.

## Layout
- `app/` — Vite React app (use **npm**, pnpm not installed).
- `data/` — extracted source of truth: `products.json`, `collections.json`.
- `content/` — page copy (about/contact/policies/blog) as markdown.
- `public/assets/` — original images + `brand/hero.mp4` (Seedance).
- `docs/` — `bug-audit.md`, `seo-report.md`, `design-study.md`.
- `.firecrawl/` — raw scrape cache (gitignored).

## Rules
- Preserve Veelux copy/images/products verbatim. Apply only layout/type/spacing/motion patterns
  from the peer study — never blend peer copy or products in.
- Checkout: CTAs link out to the live Shopify product URL (keeps real checkout) unless told otherwise.
- No auto-ship. Stop before deploy; wait for explicit approval.
- Commands: `npm run dev`, `npm run build`, `npm run preview`.
