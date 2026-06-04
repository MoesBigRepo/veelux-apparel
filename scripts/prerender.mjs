/**
 * SSG prerender: renders every known route through the SSR bundle and writes
 * dist/<route>/index.html with route-specific head (title, meta, canonical,
 * OG, JSON-LD) and full body HTML. On GitHub Pages each route becomes a real
 * file -> real HTTP 200 + server-visible markup for crawlers.
 *
 * Run from app/ after `vite build` (client) and `vite build --ssr`.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const APP = resolve(ROOT, 'app');
const DIST = resolve(APP, 'dist');
const BASE = '/veelux-apparel';

const products = JSON.parse(readFileSync(resolve(APP, 'src/data/products.json')));
const collections = JSON.parse(readFileSync(resolve(APP, 'src/data/collections.json')));

const routes = [
  '/',
  '/collections',
  '/about',
  '/contact',
  '/affiliates',
  '/policies/shipping-policy',
  '/policies/refund-policy',
  ...collections.map((c) => `/collections/${c.handle}`),
  ...products.map((p) => `/products/${p.handle}`),
];

const { render } = await import(resolve(APP, 'dist-ssr/entry-server.js'));

// Template = client build output. Strip its static title/description; every
// page gets route-specific head from Helmet instead.
const template = readFileSync(resolve(DIST, 'index.html'), 'utf8')
  .replace(/<title>[\s\S]*?<\/title>\n?/, '')
  .replace(/ *<meta\s+name="description"[\s\S]*?\/>\n?/, '');

let ok = 0;
for (const route of routes) {
  const url = route === '/' ? `${BASE}/` : `${BASE}${route}`;
  const { html, helmet } = await render(url);
  const head = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ]
    .filter(Boolean)
    .join('\n    ');
  const page = template
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const outFile =
    route === '/' ? resolve(DIST, 'index.html') : resolve(DIST, `${route.slice(1)}/index.html`);
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, page);
  ok++;
}
console.log(`prerendered ${ok}/${routes.length} routes into dist/`);
