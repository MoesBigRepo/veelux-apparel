import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE, NAV_COLLECTIONS, getCollection } from '../lib/data';

/* Bug #3 fix: single source string, repeated purely via CSS animation (not 10 DOM nodes). */
function Marquee() {
  const text = SITE.tagline;
  return (
    <div className="border-b hairline bg-obsidian text-bone overflow-hidden">
      <div className="flex whitespace-nowrap [animation:marquee_28s_linear_infinite] motion-reduce:[animation:none]">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="label py-2.5 px-8 text-[var(--color-shimmer)]">
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
            { label: 'Shipping', to: '/policies/shipping-policy' },
            { label: 'Returns', to: '/policies/refund-policy' },
          ]}
        />
        <FooterCol
          title="Brand"
          links={[
            { label: 'Our Story', to: '/about' },
            { label: 'New Arrivals', to: '/collections/new-arrivals' },
          ]}
        />
      </div>
      <div className="border-t hairline">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 py-6 flex flex-col sm:flex-row justify-between gap-3">
          <span className="label">© {new Date().getFullYear()} {SITE.legalName}</span>
          <a href={`mailto:${SITE.email}`} className="label link-underline hover:text-bone">
            {SITE.email}
          </a>
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
