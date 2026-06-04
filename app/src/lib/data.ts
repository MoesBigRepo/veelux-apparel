import productsJson from '../data/products.json';
import collectionsJson from '../data/collections.json';
import type { Product, Collection } from './types';

export const products = productsJson as Product[];
export const collections = collectionsJson as Collection[];

/**
 * Resolve a root-relative public asset path against the deploy base
 * (e.g. `/assets/x.jpg` -> `/veelux-apparel/assets/x.jpg` on GitHub Pages,
 * unchanged at root). Pass-through for absolute/external URLs.
 */
export function asset(path: string): string {
  if (!path || /^https?:\/\//.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
}

/**
 * Responsive srcset for a product JPG: 480w/960w WebP variants (generated at
 * build time, universally supported in srcset-capable browsers) with the
 * compressed original as the largest candidate. `src` stays the JPG fallback.
 */
export function srcSet(path: string): string | undefined {
  if (!/\.jpe?g$/i.test(path)) return undefined;
  const base = path.replace(/\.jpe?g$/i, '');
  return `${asset(`${base}-480.webp`)} 480w, ${asset(`${base}-960.webp`)} 960w, ${asset(path)} 1600w`;
}

const byHandle = new Map(products.map((p) => [p.handle, p]));

export function getProduct(handle: string): Product | undefined {
  return byHandle.get(handle);
}

export function getCollection(handle: string): Collection | undefined {
  return collections.find((c) => c.handle === handle);
}

export function collectionProducts(handle: string): Product[] {
  const c = getCollection(handle);
  if (!c) return [];
  return c.productHandles.map((h) => byHandle.get(h)).filter((p): p is Product => Boolean(p));
}

export const SITE = {
  name: 'VEELUX',
  legalName: 'Veelux Apparel',
  tagline: 'All Eyes on You — Limited Drops Available!',
  url: 'https://moesbigrepo.github.io/veelux-apparel',
  email: 'support@veeluxapparel.com',
  instagram: 'https://www.instagram.com/veeluxapparel',
  city: 'Brooklyn, New York',
  description:
    'Veelux is Brooklyn-born luxury rhinestone streetwear — accessible, expressive, unapologetically original. Limited drops where music meets fashion.',
};

/** lowest price across a product's variants, formatted */
export function priceLabel(p: Product): string {
  if (p.priceMax && p.priceMax !== p.price) return `$${p.price} – $${p.priceMax}`;
  return `$${p.price}`;
}

/** primary nav collections (curated subset) */
export const NAV_COLLECTIONS = ['new-arrivals', 'men', 'womens-streetwear', 'all'];
