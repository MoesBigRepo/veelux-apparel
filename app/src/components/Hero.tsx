import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState, type RefObject } from 'react';
import { asset, getProduct } from '../lib/data';
import { EASE } from './Motion';

/* Hero poster = a dramatic product still; Seedance 2.0 brand film overlays once available. */
const POSTER_SRC =
  getProduct('veelux-mens-luxury-black-hoodie')?.imagePaths[0] ||
  getProduct('rhinestone-shirt')?.imagePaths[0];
const POSTER = POSTER_SRC ? asset(POSTER_SRC) : undefined;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '18%']);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[560px] w-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        {/* Seedance 2.0 brand film; poster carries LCP and shows if video absent/reduced-motion */}
        <HeroVideo poster={POSTER} />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-transparent to-obsidian" />
        <div className="absolute inset-0 bg-obsidian/25" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5"
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="label mb-7"
        >
          Limited Drops · Brooklyn
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.32 }}
          className="display text-[15vw] sm:text-[12vw] lg:text-[10rem] leading-[0.85]"
        >
          All Eyes
          <br />
          <span className="shimmer-text">on You</span>
        </motion.h1>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/collections/new-arrivals"
            className="border border-bone px-9 py-4 label text-bone hover:bg-bone hover:text-obsidian transition-colors duration-500"
          >
            Shop New Arrivals
          </Link>
          <Link
            to="/collections/all"
            className="px-9 py-4 label text-bone-dim hover:text-bone link-underline"
          >
            Explore All
          </Link>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="label text-bone-dim"
        >
          Scroll
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Two stacked <video> layers that crossfade into each other at the loop seam,
 * so the brand film loops forever with no hard cut. Reduced-motion users get the
 * still poster only. The crossfade also masks any imperfect first/last-frame match.
 */
const XFADE = 0.7; // seconds of overlap at the loop point

function HeroVideo({ poster }: { poster?: string }) {
  const reduce = useReducedMotion();
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const [front, setFront] = useState<'a' | 'b'>('a');
  const src = asset('/assets/brand/hero.mp4');

  if (reduce) {
    return (
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center"
        style={poster ? { backgroundImage: `url(${poster})` } : undefined}
      />
    );
  }

  const handleTime = (which: 'a' | 'b') => () => {
    if (front !== which) return;
    const cur = (which === 'a' ? aRef : bRef).current;
    const other = (which === 'a' ? bRef : aRef).current;
    if (!cur || !other || !cur.duration) return;
    if (cur.currentTime >= cur.duration - XFADE) {
      other.currentTime = 0;
      void other.play().catch(() => {});
      setFront(which === 'a' ? 'b' : 'a');
    }
  };

  const layer = (which: 'a' | 'b', ref: RefObject<HTMLVideoElement | null>) => (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-linear ${
        front === which ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transitionDuration: `${XFADE}s` }}
      poster={poster}
      autoPlay={which === 'a'}
      muted
      playsInline
      preload="metadata"
      onTimeUpdate={handleTime(which)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );

  return (
    <>
      {layer('a', aRef)}
      {layer('b', bRef)}
    </>
  );
}
