import { useParams, Navigate, Link } from 'react-router-dom';
import { Seo, breadcrumbJsonLd } from '../components/Seo';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { ProductCard } from '../components/ProductCard';
import { asset, srcSet, getCollection, collectionProducts, collections } from '../lib/data';

export function Collection() {
  const { handle = '' } = useParams();
  const collection = getCollection(handle);
  if (!collection) return <Navigate to="/collections/all" replace />;
  const items = collectionProducts(handle);

  return (
    <>
      <Seo
        title={collection.title}
        description={`Shop ${collection.title} — VEELUX Brooklyn luxury rhinestone streetwear. ${items.length} pieces, limited drops.`}
        path={`/collections/${handle}`}
        image={items[0]?.imagePaths[0]}
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: collection.title, path: `/collections/${handle}` },
        ])}
      />

      <header className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-16 sm:pt-24 pb-10 border-b hairline">
        <Reveal>
          <p className="label mb-5">Collection</p>
          <h1 className="display text-5xl sm:text-7xl">{collection.title}</h1>
          <p className="label mt-6 text-bone-faint">{items.length} pieces</p>
        </Reveal>
      </header>

      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 mt-12">
        <Stagger className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-14">
          {items.map((p, i) => (
            <StaggerItem key={p.handle}>
              <ProductCard product={p} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <nav className="mx-auto max-w-[1600px] px-5 sm:px-8 mt-24 flex flex-wrap gap-x-6 gap-y-3">
        {collections.map((c) => (
          <Link
            key={c.handle}
            to={`/collections/${c.handle}`}
            className={`label link-underline ${c.handle === handle ? 'text-bone' : 'text-bone-faint hover:text-bone'}`}
          >
            {c.title}
          </Link>
        ))}
      </nav>
    </>
  );
}

export function CollectionsIndex() {
  return (
    <>
      <Seo
        title="Collections"
        description="Browse all VEELUX collections — men's and women's luxury rhinestone streetwear from Brooklyn."
        path="/collections"
      />
      <header className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-16 sm:pt-24 pb-10 border-b hairline">
        <Reveal>
          <p className="label mb-5">Index</p>
          <h1 className="display text-5xl sm:text-7xl">Collections</h1>
        </Reveal>
      </header>
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 mt-12">
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((c) => {
            const prod = collectionProducts(c.handle)[0];
            return (
              <StaggerItem key={c.handle}>
                <Link to={`/collections/${c.handle}`} className="group relative block aspect-[3/4] overflow-hidden bg-obsidian-2">
                  {prod && (
                    <img
                      src={asset(prod.imagePaths[0])}
                      srcSet={srcSet(prod.imagePaths[0])}
                      sizes="(min-width:1024px) 33vw, 100vw"
                      alt={`${c.title} collection`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-75 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="wordmark text-bone text-xl">{c.title}</span>
                    <p className="label mt-2 text-bone-dim">{collectionProducts(c.handle).length} pieces</p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>
    </>
  );
}
