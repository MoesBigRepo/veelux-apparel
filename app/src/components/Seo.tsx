import { Helmet } from '@dr.pogodin/react-helmet';
import { SITE } from '../lib/data';
import type { Product } from '../lib/types';

interface SeoProps {
  title: string;
  description: string;
  path: string; // e.g. /products/foo
  image?: string; // absolute or root-relative
  type?: 'website' | 'product' | 'article';
  jsonLd?: object | object[];
  noindex?: boolean;
}

function abs(url: string): string {
  if (!url) return SITE.url;
  return url.startsWith('http') ? url : `${SITE.url}${url}`;
}

export function Seo({ title, description, path, image, type = 'website', jsonLd, noindex }: SeoProps) {
  const url = abs(path);
  const img = abs(image || '/assets/brand/logo-dark.png');
  const fullTitle = path === '/' ? `${SITE.name} — ${SITE.tagline}` : `${title} · ${SITE.name}`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(b)}
        </script>
      ))}
    </Helmet>
  );
}

/** Product JSON-LD (schema.org Product + Offer). */
export function productJsonLd(p: Product): object {
  const images = p.imagePaths.map((i) => abs(i));
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: p.title,
    image: images,
    description: p.description.slice(0, 500),
    brand: { '@type': 'Brand', name: 'VEELUX' },
    sku: p.variants[0]?.sku || p.handle,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: p.price,
      highPrice: p.priceMax || p.price,
      offerCount: p.variants.length,
      availability: p.variants.some((v) => v.available)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: abs(`/products/${p.handle}`),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): object {
  return {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function organizationJsonLd(): object {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: abs('/assets/brand/logo-dark.png'),
    email: SITE.email,
    sameAs: [SITE.instagram],
    address: { '@type': 'PostalAddress', addressLocality: 'Brooklyn', addressRegion: 'NY', addressCountry: 'US' },
  };
}

export function websiteJsonLd(): object {
  return {
    '@context': 'https://schema.org/',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
  };
}
