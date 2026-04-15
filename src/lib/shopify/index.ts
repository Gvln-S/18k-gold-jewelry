import fs from 'node:fs';
import path from 'node:path';
import Papa from 'papaparse';
import type { Product, Collection, PageInfo } from './types';

const CSV_PATH = path.resolve('./public/products.csv');

const getLocalData = (): any[] => {
  if (!fs.existsSync(CSV_PATH)) {
    console.warn("Archivo CSV no encontrado en:", CSV_PATH);
    return [];
  }
  const fileContent = fs.readFileSync(CSV_PATH, 'utf8');
  const { data } = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
  return data;
};

const mapCsvToProduct = (item: any): Product => ({
  id: item.Handle || Math.random().toString(),
  handle: item.Handle || '',
  title: item.Title || 'Producto sin nombre',
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
  featuredImage: { url: item['Image Src'] || '', altText: item['Image Alt Text'] || item.Title, width: 800, height: 800 },
  images: item['Image Src'] ? [{ url: item['Image Src'], altText: item.Title, width: 800, height: 800 }] : [],
  variants: [],
  options: [],
  seo: { title: item.Title, description: '' },
  collections: { nodes: [] }
});

// --- FUNCIONES DEL CATÁLOGO ---

export async function getProducts() {
  const products = getLocalData().map(mapCsvToProduct);
  return { products, pageInfo: { hasNextPage: false, hasPreviousPage: false, endCursor: '' } };
}

// ESTA ES LA FUNCIÓN QUE FALTABA
export async function getCollectionProducts({ collection }: { collection: string }) {
  const all = getLocalData();
  // Filtramos por la columna 'Type' o 'Category' si existe, si no, devolvemos todos
  const filtered = all
    .filter(item => !collection || item['Type'] === collection || item['Product Category'] === collection)
    .map(mapCsvToProduct);

  return { products: filtered.length > 0 ? filtered : all.map(mapCsvToProduct) };
}

export async function getProduct(handle: string) {
  const item = getLocalData().find(p => p.Handle === handle);
  return item ? mapCsvToProduct(item) : undefined;
}

export async function getCollections(): Promise<Collection[]> {
  const data = getLocalData();
  const categories = [...new Set(data.map(item => item['Type'] || "General"))];
  return categories.map(cat => ({
    handle: cat.toLowerCase(),
    title: cat,
    description: '',
    path: `/search/${cat.toLowerCase()}`,
    updatedAt: new Date().toISOString(),
    seo: { title: cat, description: '' }
  }));
}

// --- STUBS PARA COMPATIBILIDAD ---
export async function getProductRecommendations() { return []; }
export async function getTags() { return []; }
export async function getHighestProductPrice() { return { amount: "0", currencyCode: "USD" }; }
export async function getVendors() { return []; }
export async function getUserDetails() { return null; }
export async function getCart() { return null; }
export async function addToCart() { return null; }
export async function createCart() { return null; }
export async function removeFromCart() { return null; }
export async function updateCart() { return null; }
