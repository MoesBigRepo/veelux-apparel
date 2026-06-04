import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { SITE, asset, srcSet, products } from '../lib/data';

/* ------------------------------- Size Guide -------------------------------- */
/* Size runs are read straight from live variant data — never hand-maintained. */

function sizeRun(handle: string): string {
  const p = products.find((x) => x.handle === handle);
  const opt = p?.options.find((o) => /size/i.test(o.name));
  return opt ? opt.values.join(' · ') : 'One size';
}

const isOversized = (handle: string) =>
  products.find((x) => x.handle === handle)?.tags?.some((t) => /oversized/i.test(String(t))) ??
  false;

export function SizeGuide() {
  const rows = products
    .filter((p) => p.options.some((o) => /size/i.test(o.name)))
    .map((p) => ({
      handle: p.handle,
      title: p.title,
      type: p.productType || 'Apparel',
      run: sizeRun(p.handle),
      oversized: isOversized(p.handle),
    }));

  return (
    <>
      <Seo
        title="Size Guide"
        description="VEELUX size guide — available size runs for every piece, fit notes for oversized cuts, and how to measure at home."
        path="/size-guide"
      />
      <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-20 sm:pt-28">
        <Reveal>
          <p className="label mb-5">Fit &amp; Sizing</p>
          <h1 className="display text-5xl sm:text-7xl">Size Guide</h1>
          <p className="mt-7 text-bone-dim max-w-lg leading-relaxed">
            Every size we cut, per piece. Pieces marked oversized are designed to wear relaxed and
            roomy — that drape is the look.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <div className="border-t hairline">
            {rows.map((r) => (
              <Link
                key={r.handle}
                to={`/products/${r.handle}`}
                className="grid sm:grid-cols-[1.4fr_1fr] gap-x-6 gap-y-1 py-5 border-b hairline group"
              >
                <div>
                  <span className="text-bone group-hover:text-shimmer transition-colors">{r.title}</span>
                  <span className="label block mt-1.5 text-bone-faint">
                    {r.type}
                    {r.oversized ? ' · Oversized fit' : ''}
                  </span>
                </div>
                <span className="font-mono text-sm text-bone-dim sm:text-right self-center">{r.run}</span>
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <h2 className="label mb-6">How to measure at home</h2>
          <div className="space-y-4 text-bone-dim leading-relaxed text-[0.95rem]">
            <p><b className="text-bone">Chest</b> — measure around the fullest part of your chest, tape level under the arms.</p>
            <p><b className="text-bone">Waist (jeans)</b> — measure around your natural waistline where the waistband sits. Our denim is sized by waist measurement in inches.</p>
            <p><b className="text-bone">Compare with a piece you own</b> — lay your best-fitting hoodie or jeans flat and match its measurements against your usual size.</p>
            <p>
              Between sizes on an oversized piece? Take your usual size for the full relaxed
              silhouette. Unsure? Email{' '}
              <a href={`mailto:${SITE.email}`} className="link-underline text-bone">{SITE.email}</a>{' '}
              with your height and usual size — we will size you ourselves.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}

/* ----------------------------------- FAQ ----------------------------------- */
/* Answers are condensed verbatim from the live shipping + refund policies.    */

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How long does shipping take?',
    a: 'Orders are processed within 1-2 business days after payment. Standard shipping delivers in an estimated 5-7 business days, express in 2-3 business days. International delivery times vary by destination.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes, we ship worldwide. For international orders, customs duties, taxes and fees may apply on delivery — these are the responsibility of the recipient and are not included in the shipping cost.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order ships you receive a shipping confirmation email with a tracking number. Use it to follow your package the whole way.',
  },
  {
    q: 'What is your return policy?',
    a: 'You have 7 days after receiving your item to request a return for store credit. Items must be unworn, unused, with tags, in original packaging, with proof of purchase. Start a return by emailing support@veeluxapparel.com. Sale items and gift cards are non-returnable. EU orders have a 14-day cooling-off period.',
  },
  {
    q: 'Can I exchange for a different size?',
    a: 'The fastest route is to return the piece you have and place a separate order for the size you want once the return is accepted.',
  },
  {
    q: 'My order arrived damaged — what now?',
    a: 'Inspect your order on arrival and contact us immediately at support@veeluxapparel.com if anything is defective, damaged, or wrong. We will evaluate the issue and make it right.',
  },
  {
    q: 'What does "limited drop" mean?',
    a: 'Veelux releases in limited runs. When a drop sells through, it is gone — pieces are not guaranteed to restock. All eyes on you, not on a re-run.',
  },
  {
    q: 'How does the affiliate program work?',
    a: 'Apply on our Affiliates page, get your unique referral link, share Veelux with your people, and earn on every sale that comes through your link. Signup, login and commission terms live on the Veelux affiliate portal.',
  },
];

export function Faq() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <Seo
        title="FAQ"
        description="VEELUX FAQ — shipping times, worldwide delivery, returns and store credit, exchanges, limited drops, and the affiliate program."
        path="/faq"
        jsonLd={faqJsonLd}
      />
      <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-20 sm:pt-28">
        <Reveal>
          <p className="label mb-5">Answers</p>
          <h1 className="display text-5xl sm:text-7xl">FAQ</h1>
        </Reveal>

        <div className="mt-14 border-t hairline">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <details className="group border-b hairline">
                <summary className="flex items-baseline justify-between gap-6 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h2 className="text-bone text-base sm:text-lg font-medium leading-snug">{f.q}</h2>
                  <span className="label text-bone-faint group-open:rotate-45 transition-transform shrink-0" aria-hidden="true">+</span>
                </summary>
                <p className="pb-7 -mt-1 text-bone-dim leading-relaxed text-[0.95rem] max-w-[64ch]">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <p className="text-bone-dim">
            Something else?{' '}
            <a href={`mailto:${SITE.email}`} className="link-underline text-bone">{SITE.email}</a>
            {' '}or the{' '}
            <Link to="/contact" className="link-underline text-bone">contact page</Link>.
          </p>
        </Reveal>
      </div>
    </>
  );
}

/* --------------------------------- Lookbook -------------------------------- */
/* Editorial gallery assembled from real campaign/product photography only.    */

const LOOKS: { handle: string; img: number; note: string }[] = [
  { handle: 'veelux-mens-luxury-black-hoodie', img: 0, note: 'Black Rhinestone Hoodie' },
  { handle: 'rhinestone-star-power-jean-special-edition', img: 1, note: 'Star Power Jean' },
  { handle: 'veelux-womens-luxury-pink-hoodie', img: 0, note: 'Pink Oversized Hoodie' },
  { handle: 'untitled-oct24_15-22', img: 1, note: 'StarPower Hoodie' },
  { handle: 'jean-jacket', img: 0, note: 'Rhinestone Jean Jacket' },
  { handle: 'veelux-mens-luxury-rhinestone-flannel-shirt', img: 0, note: 'Rhinestone Flannel' },
  { handle: 'veelux-womens-luxury-pink-sweatpants', img: 0, note: 'Pink Sweatpants' },
  { handle: 'plain-jean', img: 0, note: 'Stacked Denim' },
  { handle: 'veelux-mens-luxury-black-sweatpants', img: 0, note: 'Black Reflective Joggers' },
  { handle: 'rhinestone-shirt', img: 0, note: 'StarPower Power Shirt' },
];

export function Lookbook() {
  const looks = LOOKS.map((l) => {
    const p = products.find((x) => x.handle === l.handle);
    const path = p?.imagePaths[l.img] || p?.imagePaths[0];
    return p && path ? { ...l, path, title: p.title } : null;
  }).filter((l): l is NonNullable<typeof l> => l !== null);

  return (
    <>
      <Seo
        title="Lookbook"
        description="The VEELUX lookbook — Brooklyn luxury rhinestone streetwear shot dark and loud. Every look links straight to the piece."
        path="/lookbook"
        image={looks[0]?.path}
      />
      <header className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-16 sm:pt-24 pb-10 border-b hairline">
        <Reveal>
          <p className="label mb-5">Editorial</p>
          <h1 className="display text-5xl sm:text-8xl">Look<span className="shimmer-text">book</span></h1>
          <p className="mt-6 text-bone-dim max-w-md leading-relaxed">
            Shot dark, worn loud. Tap any look to shop the piece.
          </p>
        </Reveal>
      </header>

      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 mt-12">
        <Stagger className="columns-2 lg:columns-3 gap-5 [&>*]:break-inside-avoid">
          {looks.map((l, i) => (
            <StaggerItem key={`${l.handle}-${l.img}`}>
              <Link to={`/products/${l.handle}`} className="group relative block overflow-hidden bg-obsidian-2 mb-5">
                <img
                  src={asset(l.path)}
                  srcSet={srcSet(l.path)}
                  sizes="(min-width:1024px) 33vw, 50vw"
                  alt={`${l.title} — Veelux lookbook`}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/85 to-transparent pt-14 pb-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="label text-bone">{l.note}</span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
