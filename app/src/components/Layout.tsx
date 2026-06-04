import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE, NAV_COLLECTIONS, getCollection } from '../lib/data';

/** Instagram glyph (Simple Icons path), inherits currentColor. */
function InstagramIcon({ className = 'w-[18px] h-[18px]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

/* Bug #3 fix: single source string, repeated purely via CSS animation (not 10 DOM nodes). */
function Marquee() {
  const text = SITE.tagline;
  return (
    <div className="border-b hairline bg-obsidian text-bone overflow-hidden">
      <div className="flex whitespace-nowrap [animation:marquee_28s_linear_infinite] motion-reduce:[animation:none]">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} aria-hidden={i > 0 || undefined} className="label py-2.5 px-8 text-[var(--color-shimmer)]">
            {text}
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      {NAV_COLLECTIONS.map((h) => {
        const c = getCollection(h);
        if (!c) return null;
        return (
          <NavLink
            key={h}
            to={`/collections/${h}`}
            onClick={onClick}
            className={({ isActive }) =>
              `label link-underline ${isActive ? 'text-bone' : 'text-bone-dim'} hover:text-bone transition-colors`
            }
          >
            {c.title}
          </NavLink>
        );
      })}
      <NavLink
        to="/about"
        onClick={onClick}
        className={({ isActive }) =>
          `label link-underline ${isActive ? 'text-bone' : 'text-bone-dim'} hover:text-bone transition-colors`
        }
      >
        Story
      </NavLink>
      <NavLink
        to="/affiliates"
        onClick={onClick}
        className={({ isActive }) =>
          `label link-underline ${isActive ? 'text-bone' : 'text-bone-dim'} hover:text-bone transition-colors`
        }
      >
        Affiliates
      </NavLink>
    </>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-obsidian/85 backdrop-blur-md border-b hairline' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16">
          {/* left: desktop nav / mobile toggle */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLinks />
          </nav>
          <button
            className="md:hidden justify-self-start label text-bone"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? 'Close' : 'Menu'}
          </button>

          {/* center: wordmark */}
          <Link to="/" className="justify-self-center">
            <span className="wordmark text-bone text-lg sm:text-xl">{SITE.name}</span>
          </Link>

          {/* right */}
          <div className="justify-self-end flex items-center gap-6">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Veelux on Instagram"
              className="text-bone-dim hover:text-bone transition-colors"
            >
              <InstagramIcon />
            </a>
            <Link to="/collections/all" className="label text-bone-dim hover:text-bone link-underline">
              Shop
            </Link>
          </div>
        </div>
      </div>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-b hairline bg-obsidian"
          >
            <div className="flex flex-col gap-5 px-5 py-7">
              <NavLinks onClick={() => setOpen(false)} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t hairline mt-24">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <span className="wordmark text-bone text-2xl">{SITE.name}</span>
          <p className="mt-5 max-w-xs text-bone-dim text-sm leading-relaxed">{SITE.description}</p>
          <p className="label mt-6">{SITE.city}</p>
        </div>
        <FooterCol title="Shop" links={NAV_COLLECTIONS.map((h) => ({ label: getCollection(h)?.title || h, to: `/collections/${h}` }))} />
        <FooterCol
          title="Help"
          links={[
            { label: 'Contact', to: '/contact' },
            { label: 'FAQ', to: '/faq' },
            { label: 'Size Guide', to: '/size-guide' },
            { label: 'Shipping', to: '/policies/shipping-policy' },
            { label: 'Returns', to: '/policies/refund-policy' },
          ]}
        />
        <FooterCol
          title="Brand"
          links={[
            { label: 'Our Story', to: '/about' },
            { label: 'Lookbook', to: '/lookbook' },
            { label: 'New Arrivals', to: '/collections/new-arrivals' },
            { label: 'Affiliates', to: '/affiliates' },
          ]}
        />
      </div>
      <div className="border-t hairline">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="label">© {new Date().getFullYear()} {SITE.legalName}</span>
          <div className="flex items-center gap-6">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Veelux on Instagram"
              className="text-bone-dim hover:text-bone transition-colors"
            >
              <InstagramIcon />
            </a>
            <a href={`mailto:${SITE.email}`} className="label link-underline hover:text-bone">
              {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="label mb-5">{title}</h4>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-bone-dim hover:text-bone text-sm link-underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="min-h-screen flex flex-col">
      <Marquee />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
