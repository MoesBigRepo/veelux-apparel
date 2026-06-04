import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUB = resolve(ROOT, 'app/public');
const SITE = 'https://moesbigrepo.github.io/veelux-apparel';

const products = JSON.parse(readFileSync(resolve(ROOT, 'data/products.json')));
const collections = JSON.parse(readFileSync(resolve(ROOT, 'data/collections.json')));

const urls = [
  { loc: '/', priority: '1.0' },
  { loc: '/collections', priority: '0.8' },
  { loc: '/about', priority: '0.7' },
  { loc: '/contact', priority: '0.5' },
  { loc: '/affiliates', priority: '0.6' },
  { loc: '/size-guide', priority: '0.6' },
  { loc: '/faq', priority: '0.6' },
  { loc: '/lookbook', priority: '0.7' },
  { loc: '/policies/shipping-policy', priority: '0.3' },
  { loc: '/policies/refund-policy', priority: '0.3' },
  ...collections.map((c) => ({ loc: `/collections/${c.handle}`, priority: '0.8' })),
  ...products.map((p) => ({ loc: `/products/${p.handle}`, priority: '0.9' })),
];

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${SITE}${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`;
writeFileSync(resolve(PUB, 'sitemap.xml'), xml);

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
writeFileSync(resolve(PUB, 'robots.txt'), robots);

const llms = `# VEELUX — Brooklyn Luxury Rhinestone Streetwear

> Veelux is Brooklyn-born luxury rhinestone streetwear: accessible, expressive, unapologetically
> original. Limited drops where music meets fashion. Founded by a Brooklyn music artist.
> Tagline: "All Eyes on You — Limited Drops Available!"

Site: ${SITE}
Contact: support@veeluxapparel.com
Checkout: product pages link to the brand's live Shopify checkout.
Returns: 7-day window, store credit. Shipping: worldwide.

## Products (${products.length})
${products.map((p) => `- [${p.title}](${SITE}/products/${p.handle}) — $${p.price}${p.priceMax && p.priceMax !== p.price ? `–$${p.priceMax}` : ''}`).join('\n')}

## Collections (${collections.length})
${collections.map((c) => `- [${c.title}](${SITE}/collections/${c.handle})`).join('\n')}

## Pages
- [Our Story](${SITE}/about)
- [Affiliate Program](${SITE}/affiliates)
- [Contact](${SITE}/contact)
- [Shipping Policy](${SITE}/policies/shipping-policy)
- [Returns & Refunds](${SITE}/policies/refund-policy)
`;
writeFileSync(resolve(PUB, 'llms.txt'), llms);

console.log(`sitemap.xml: ${urls.length} urls; robots.txt + llms.txt written`);
