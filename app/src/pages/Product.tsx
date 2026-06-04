import { useParams, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Seo, productJsonLd, breadcrumbJsonLd } from '../components/Seo';
import { Reveal } from '../components/Motion';
import { ProductCard } from '../components/ProductCard';
import { asset, srcSet, getProduct, products, priceLabel } from '../lib/data';

export function Product() {
  const { handle = '' } = useParams();
  const product = getProduct(handle);
  const [active, setActive] = useState(0);
  const [variant, setVariant] = useState(0);

  if (!product) return <Navigate to="/collections/all" replace />;

  const related = products.filter((p) => p.handle !== product.handle).slice(0, 4);
  const sizeOption = product.options.find((o) => /size/i.test(o.name));

  return (
    <>
      <Seo
        title={product.title}
        description={product.description.slice(0, 160) || `${product.title} — VEELUX luxury streetwear.`}
        path={`/products/${product.handle}`}
        image={product.imagePaths[0]}
        type="product"
        jsonLd={[
          productJsonLd(product),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Shop', path: '/collections/all' },
            { name: product.title, path: `/products/${product.handle}` },
          ]),
        ]}
      />

      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-8">
        <nav className="label flex gap-2 text-bone-faint">
          <Link to="/" className="hover:text-bone">Home</Link>
          <span>/</span>
          <Link to="/collections/all" className="hover:text-bone">Shop</Link>
          <span>/</span>
          <span className="text-bone-dim truncate">{product.title}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 mt-6 grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-3 overflow-auto">
            {product.imagePaths.map((img, i) => (
              <button
                key={img}
                onClick={() => setActive(i)}
                className={`relative shrink-0 w-16 h-20 sm:w-20 sm:h-24 overflow-hidden bg-obsidian-2 border transition-colors ${
                  active === i ? 'border-bone' : 'border-transparent hover:border-hairline'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={asset(img)} srcSet={srcSet(img)} sizes="80px" alt={`${product.title} thumbnail ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <div className="flex-1">
            <motion.div
              key={active}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] overflow-hidden bg-obsidian-2"
            >
              <img
                src={asset(product.imagePaths[active])}
                srcSet={srcSet(product.imagePaths[active])}
                sizes="(min-width:1024px) 50vw, 100vw"
                alt={`${product.title} — view ${active + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </div>

        {/* Info — sticky */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="label mb-4">{product.productType || 'VEELUX'}</p>
          <h1 className="display text-3xl sm:text-5xl leading-[0.95]">{product.title}</h1>
          <p className="mt-6 font-mono text-xl text-bone">{priceLabel(product)}</p>

          {sizeOption && (
            <div className="mt-9">
              <p className="label mb-4">Size — {sizeOption.name}</p>
              <div className="flex flex-wrap gap-3">
                {sizeOption.values.map((val, i) => (
                  <button
                    key={val}
                    onClick={() => setVariant(i)}
                    className={`min-w-12 px-4 py-3 label border transition-colors ${
                      variant === i ? 'border-bone bg-bone text-obsidian' : 'border-hairline text-bone-dim hover:border-bone hover:text-bone'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}

          <a
            href={product.shopifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 block w-full text-center bg-bone text-obsidian py-4.5 label hover:bg-shimmer transition-colors duration-400"
          >
            Add to Cart — Checkout
          </a>
          <p className="mt-3 label text-bone-faint text-center">Secure checkout · Limited drop</p>

          {product.description && (
            <div className="mt-12 border-t hairline pt-8">
              <h2 className="label mb-5">Details</h2>
              <div className="prose-veelux text-bone-dim leading-relaxed space-y-4 text-[0.95rem]">
                {product.description.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 border-t hairline pt-8 grid grid-cols-2 gap-y-4">
            <Info label="Shipping" value="Worldwide" />
            <Info label="Returns" value="7-day store credit" />
            <Info label="Vendor" value={product.vendor} />
            <Info label="Made for" value="The Bold" />
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 mt-28">
        <Reveal className="border-b hairline pb-6 mb-10">
          <h2 className="display text-2xl sm:text-4xl">You May Also Like</h2>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
          {related.map((p, i) => (
            <ProductCard key={p.handle} product={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label text-bone-faint">{label}</p>
      <p className="text-sm text-bone mt-1">{value}</p>
    </div>
  );
}
