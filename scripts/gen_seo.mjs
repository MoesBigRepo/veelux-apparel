import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUB = resolve(ROOT, 'app/public');
const SITE = 'https://veeluxapparel.com';

const products = JSON.parse(readFileSync(resolve(ROOT, 'data/products.json')));
const collections = JSON.parse(readFileSync(resolve(ROOT, 'data/collections.json')));

const urls = [
  { loc: '/', priority: '1.0' },
  { loc: '/collections', priority: '0.8' },
  { loc: '/about', priority: '0.7' },
  { loc: '/contact', priority: '0.5' },
  { loc: '/policies/shipping-policy', priority: '0.3' },
  { loc: '/policies/refund-policy', priority: '0.3' },
  ...collections.map((c) => ({ loc: `/collections/${c.handle}`, priority: '0.8' })),
  ...products.map((p) => ({ loc: `/products/${p.handle}`, priority: '0.9' })),
];

const today = '2026-06-02';
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

console.log(`sitemap.xml: ${urls.length} urls; robots.txt written`);
