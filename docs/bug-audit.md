# Veelux Apparel — Bug Audit

Source: live site scrape + native Shopify JSON + raw-HTML inspection (2026-06-02).
Bugs are **fixed by correct reimplementation** in the React rebuild (we don't control their Shopify).

| # | Severity | Bug | Evidence | Fix in rebuild |
|---|----------|-----|----------|----------------|
| 1 | High | **Dead country/currency selector** — every locale option links to `/#` (200+ dead anchors in nav + footer). | Homepage/about markdown: hundreds of `[… ](https://veeluxapparel.com/#)` country rows. | Drop the fake multi-currency widget. Single clean USD store; if locale switching is ever wanted, wire a real one. Removes 200+ dead links + huge DOM. |
| 2 | High | **Non-descriptive / missing alt text** — hero `alt="index"`; product imagery lacks descriptive alt. | Scrape: `![index](…)`. | Generate descriptive alt per image: `"{product title} — view {n}"`; brand/hero alt describes scene. (a11y + image SEO) |
| 3 | Med | **Duplicate marquee DOM** — "All Eyes on You — Limited Drops Available!" rendered as 10 separate stacked nodes. | Scrape shows the line repeated 10×. | One CSS/Framer marquee that visually repeats via animation, single source string. |
| 4 | Med | **Unfilled theme placeholders shipped to prod** — About page shows literal `Sub Title`, `Heading`, `Protection from the` (leftover Shopify section defaults). | Raw `/pages/about-us` main content. | Rebuild About from the real brand story copy only; no placeholder leakage. |
| 5 | Low | **Public `/agents.md`** exposed at site root. | Present in firecrawl map. | Not carried into rebuild. |
| 6 | Med | **Thin / templated pages** — Contact is a bare form; About leans on a background video with minimal structured copy; no size guide, no FAQ. | Page extracts. | Keep real copy; structure it properly (typeset About, real contact details incl. `support@veeluxapparel.com`, policies as readable pages). |
| 7 | Med | **Weak SEO metadata** (detailed in `seo-report.md`) — generic titles, no Product JSON-LD, no per-product OG. | Scrape head. | Full SEO pass in Phase 3. |
| 8 | Low | **Heavy unoptimized imagery** — large Shopify-served PNG/JPG, no responsive `srcset` in the scraped markup; CLS risk. | 90 MB of source images for 10 products. | `srcset`/lazy-load, width-capped derivatives, explicit aspect-ratio boxes to kill CLS. |

## Data integrity notes (carried into rebuild, not bugs)
- 10 live products, prices $80–$165, 2–6 variants each, 4–16 images each.
- Returns: 7-day window, **store credit only**; support `support@veeluxapparel.com`.
- Brand: Brooklyn, founded by a musician; positioning = accessible luxury rhinestone streetwear;
  tagline **"All Eyes on You — Limited Drops Available!"**
