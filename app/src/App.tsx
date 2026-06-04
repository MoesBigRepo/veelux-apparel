import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { Seo } from './components/Seo';
import { Home } from './pages/Home';

const Product = lazy(() => import('./pages/Product').then((m) => ({ default: m.Product })));
const Collection = lazy(() => import('./pages/Collection').then((m) => ({ default: m.Collection })));
const CollectionsIndex = lazy(() =>
  import('./pages/Collection').then((m) => ({ default: m.CollectionsIndex })),
);
const About = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.About })));
const Affiliates = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.Affiliates })));
const Contact = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.Contact })));
const Policy = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.Policy })));
const SizeGuide = lazy(() => import('./pages/Editorial').then((m) => ({ default: m.SizeGuide })));
const Faq = lazy(() => import('./pages/Editorial').then((m) => ({ default: m.Faq })));
const Lookbook = lazy(() => import('./pages/Editorial').then((m) => ({ default: m.Lookbook })));

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function NotFound() {
  return (
    <>
      <Seo title="Not Found" description="Page not found." path="/404" noindex />
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
        <h1 className="display text-7xl">404</h1>
        <p className="mt-5 text-bone-dim">This drop doesn’t exist.</p>
        <Link to="/" className="mt-8 border hairline px-8 py-3.5 label hover:bg-bone hover:text-obsidian transition-colors">
          Back Home
        </Link>
      </div>
    </>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/products/:handle" element={<Page><Product /></Page>} />
          <Route path="/collections" element={<Page><CollectionsIndex /></Page>} />
          <Route path="/collections/:handle" element={<Page><Collection /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/affiliates" element={<Page><Affiliates /></Page>} />
          <Route path="/size-guide" element={<Page><SizeGuide /></Page>} />
          <Route path="/faq" element={<Page><Faq /></Page>} />
          <Route path="/lookbook" element={<Page><Lookbook /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />
          <Route path="/policies/:handle" element={<Page><Policy /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
        </Suspense>
      </AnimatePresence>
    </Layout>
  );
}
