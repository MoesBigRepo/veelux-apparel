import { Link } from 'react-router-dom';
import { useState } from 'react';
import { asset, srcSet, priceLabel } from '../lib/data';
import type { Product } from '../lib/types';

const CARD_SIZES = '(min-width:1024px) 25vw, 50vw';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [hover, setHover] = useState(false);
  const rawPrimary = product.imagePaths[0];
  const rawSecondary = product.imagePaths[1] || rawPrimary;
  const primary = asset(rawPrimary);
  const secondary = asset(rawSecondary);
  return (
    <Link
      to={`/products/${product.handle}`}
      className="group block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-obsidian-2">
        <img
          src={primary}
          srcSet={srcSet(rawPrimary)}
          sizes={CARD_SIZES}
          alt={`${product.title} — front view`}
          loading={index < 4 ? 'eager' : 'lazy'}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            hover && secondary !== primary ? 'opacity-0' : 'opacity-100'
          } group-hover:scale-[1.03]`}
        />
        {secondary !== primary && (
          <img
            src={secondary}
            srcSet={srcSet(rawSecondary)}
            sizes={CARD_SIZES}
            alt={`${product.title} — alternate view`}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              hover ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-[1.03]`}
          />
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="text-sm text-bone leading-snug pr-2">{product.title}</h3>
        <span className="label text-bone whitespace-nowrap">{priceLabel(product)}</span>
      </div>
    </Link>
  );
}
