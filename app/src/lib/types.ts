export interface Variant {
  id: number;
  title: string;
  price: string;
  available: boolean;
  sku: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
}

export interface ProductOption {
  name: string;
  position: number;
  values: string[];
}

export interface Product {
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  tags: string[];
  descriptionHtml: string;
  description: string;
  price: string;
  priceMax: string;
  options: ProductOption[];
  variants: Variant[];
  images: string[];
  imagePaths: string[];
  shopifyUrl: string;
}

export interface Collection {
  handle: string;
  title: string;
  productHandles: string[];
}
