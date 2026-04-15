import fs from 'node:fs';
import path from 'node:path';
import Papa from 'papaparse';
import type { Product, Collection, PageInfo } from './types';

const CSV_PATH = path.resolve('./public/products.csv');

const getLocalData = (): any[] => {
  if (!fs.existsSync(CSV_PATH)) return [];
  const fileContent = fs.readFileSync(CSV_PATH, 'utf8');
  const { data } = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
  return data;
};

const mapCsvToProduct = (item: any): Product => ({
  id: item.Handle || Math.random().toString(),
  handle: item.Handle || '',
  title: item.Title || '',
  description: item['Body (HTML)'] || '',
  descriptionHtml: item['Body (HTML)'] || '',
  availableForSale: true,
  vendor: item.Vendor || '',
  tags: item.Tags ? item.Tags.split(',').map((t: string) => t.trim()) : [],
  updatedAt: new Date().toISOString(),
  priceRange: {
    minVariantPrice: { amount: item['Variant Price'] || "0", currencyCode: "USD" },
    maxVariantPrice: { amount: item['Variant Price'] || "0", currencyCode: "USD" }
  },
  compareAtPriceRange: {
    maxVariantPrice: { amount: item['Variant Compare At Price'] || "0", currencyCode: "USD" }
  },
  featuredImage: { url: item['Image Src'] || '', altText: item.Title, width: 800, height: 800 },
  images: item['Image Src'] ? [{ url: item['Image Src'], altText: item.Title, width: 800, height: 800 }] : [],
  variants: [],
  options: [],
  seo: { title: item.Title, description: '' },
  collections: { nodes: [{ title: item['Product Category'] || "General" }] }
});

export async function getProducts({ query, minPrice, maxPrice, category }: any = {}) {
  const all = getLocalData().map(mapCsvToProduct);
  let filtered = all;

  if (query) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(p =>
      p.collections.nodes.some(c => c.title.toLowerCase() === category.toLowerCase())
    );
  }

  // Filtro de precio
  if (minPrice || maxPrice) {
    filtered = filtered.filter(p => {
      const price = parseFloat(p.priceRange.minVariantPrice.amount);
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return price >= min && price <= max;
    });
  }

  return {
    products: filtered,
    pageInfo: { hasNextPage: false, hasPreviousPage: false, endCursor: '' }
  };
}

export async function getCollectionProducts({ collection }: { collection: string }) {
  const all = getLocalData();
  const filtered = all.filter(item => item['Product Category'] === collection).map(mapCsvToProduct);
  return { products: filtered };
}

export async function getCollections(): Promise<Collection[]> {
  const data = getLocalData();
  const categories = [...new Set(data.map(item => item['Product Category']).filter(Boolean))];
  return categories.map(cat => ({
    handle: cat as string,
    title: cat as string,
    path: `/products?category=${cat}`,
    updatedAt: '',
    seo: { title: cat as string, description: '' },
    description: ''
  }));
}

// Stubs para evitar errores
export async function getProduct(handle: string) { return getLocalData().map(mapCsvToProduct).find(p => p.handle === handle); }
export async function getHighestProductPrice() {
  const prices = getLocalData().map(p => parseFloat(p['Variant Price'] || "0"));
  return { amount: Math.max(...prices, 0).toString(), currencyCode: "USD" };
}
export async function getTags() { return []; }
export async function getVendors() { return []; }
export async function getProductRecommendations() { return []; }
export async function getUserDetails() { return null; }
export async function getCart() { return null; }
export async function addToCart() { return null; }
export async function createCart() { return null; }
export async function removeFromCart() { return null; }
export async function updateCart() { return null; }
