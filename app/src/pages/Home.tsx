import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { Seo, organizationJsonLd, websiteJsonLd } from '../components/Seo';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { ProductCard } from '../components/ProductCard';
import { SITE, asset, srcSet, collectionProducts, getProduct, getCollection } from '../lib/data';
import { Hero } from '../components/Hero';

export function Home() {
  const newArrivals = collectionProducts('new-arrivals').slice(0, 8);
  const featured = collectionProducts('all').slice(0, 8);
  const list = (newArrivals.length ? newArrivals : featured).slice(0, 8);

  const editorial = getProduct('rhinestone-star-power-jean-special-edition') || getProduct('jean-jacket');
  const storyRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%']);

  const collTiles = ['men', 'womens-streetwear', 'jean', 'hoodies']
    .map((h) => getCollection(h))
    .filter(Boolean);

  return (
    <>
      <Seo title="Home" description={SITE.description} path="/" jsonLd={[organizationJsonLd(), websiteJsonLd()]} />

      <Hero />

      {/* New arrivals */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 mt-24 sm:mt-32">
        <Reveal className="flex items-end justify-between border-b hairline pb-6 mb-10">
          <h2 className="display text-3xl sm:text-5xl">New Arrivals</h2>
          <Link to="/collections/new-arrivals" className="label link-underline hover:text-bone">
            View all
          </Link>
        </Reveal>
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
          {list.map((p, i) => (
            <StaggerItem key={p.handle}>
              <ProductCard product={p} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Editorial split — brand story */}
      <section ref={storyRef} className="relative mt-28 sm:mt-40 grid md:grid-cols-2 items-stretch">
        <div className="relative overflow-hidden min-h-[60vh] md:min-h-[80vh] bg-obsidian-2">
          {editorial && (
            <motion.img
              style={{ y: imgY }}
              src={asset(editorial.imagePaths[0])}
              srcSet={srcSet(editorial.imagePaths[0])}
              sizes="(min-width:768px) 50vw, 100vw"
              alt={`${editorial.title} — Veelux editorial`}
              className="absolute inset-0 h-[116%] w-full object-cover -top-[8%]"
              loading="lazy"
            />
          )}
        </div>
        <div className="flex items-center bg-obsidian px-6 sm:px-14 py-20">
          <Reveal>
            <p className="label mb-6">Born in Brooklyn</p>
            <h2 className="display text-4xl sm:text-6xl max-w-md">
              Built for <span className="shimmer-text">the Bold</span>
            </h2>
            <p className="mt-8 max-w-md text-bone-dim leading-relaxed">
              Where culture, rhythm and resilience collide. Founded by a Brooklyn artist, Veelux
              redefines high-end streetwear — luxury-inspired pieces that are accessible, expressive
              and unapologetically original. Every stitch tells a story.
            </p>
            <Link
              to="/about"
              className="inline-block mt-10 border hairline px-8 py-3.5 label text-bone hover:bg-bone hover:text-obsidian transition-colors duration-500"
            >
              Our Story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Collection tiles */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 mt-28 sm:mt-40">
        <Reveal className="mb-10">
          <h2 className="display text-3xl sm:text-5xl">Shop by Category</h2>
        </Reveal>
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {collTiles.map((c) => {
            const prod = collectionProducts(c!.handle)[0];
            return (
              <StaggerItem key={c!.handle}>
                <Link to={`/collections/${c!.handle}`} className="group relative block aspect-[3/4] overflow-hidden bg-obsidian-2">
                  {prod && (
                    <img
                      src={asset(prod.imagePaths[0])}
                      srcSet={srcSet(prod.imagePaths[0])}
                      sizes="(min-width:1024px) 25vw, 50vw"
                      alt={`${c!.title} collection`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
                  <span className="absolute bottom-5 left-5 wordmark text-bone text-lg">{c!.title}</span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>
    </>
  );
}
