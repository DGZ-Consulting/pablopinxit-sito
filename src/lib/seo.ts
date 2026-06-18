import type { PortfolioCategory, PortfolioItem } from './crm';

export const STATIC_CATEGORY_ROUTES = new Set(['videos', 'arts-books']);

export const SITE = {
  name: 'Pablo Pinxit',
  url: 'https://pablopinxit.com',
  locale: 'en_US',
  defaultDescription:
    'Portfolio of Pablo Pinxit (Pablo Compagnucci) — Argentine-Italian visual artist exploring pictorial collage, street art, walls, and mixed media across galleries and public spaces.',
  artist: {
    legalName: 'Pablo Compagnucci',
    name: 'Pablo Pinxit',
    birthPlace: 'La Plata, Argentina',
    birthYear: 1964,
    email: 'contact@pablopinxit.com',
    sameAs: [
      'https://www.facebook.com/pablopinxit',
      'https://www.instagram.com/pablopinxit/',
    ],
  },
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).href;
}

export function imageAlt(
  title: string | null | undefined,
  categoryName: string,
  index?: number,
): string {
  if (title?.trim()) return `${title.trim()} — Pablo Pinxit`;
  if (index !== undefined) return `${categoryName} artwork ${index + 1} — Pablo Pinxit`;
  return `${categoryName} — Pablo Pinxit`;
}

export function categoryDescription(name: string, description: string | null): string {
  if (description?.trim()) return description.trim();
  return `Explore ${name}, a collection of visual art by Pablo Pinxit — Argentine-Italian artist working in pictorial collage, street art, and mixed media.`;
}

export function coverAlt(categoryName: string): string {
  return `${categoryName} portfolio cover — Pablo Pinxit`;
}

export function sortPortfolioItems(items: PortfolioItem[]): PortfolioItem[] {
  return [...items].sort((a, b) => a.sort_order - b.sort_order);
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: SITE.defaultDescription,
    inLanguage: 'en',
    author: { '@type': 'Person', name: SITE.artist.name },
  };
}

export function buildPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.artist.name,
    alternateName: SITE.artist.legalName,
    url: SITE.url,
    email: SITE.artist.email,
    birthPlace: SITE.artist.birthPlace,
    birthDate: `${SITE.artist.birthYear}`,
    jobTitle: 'Visual Artist',
    description:
      'Argentine-Italian visual artist working in pictorial collage, street art, and mixed media. Exhibited in galleries and museums internationally.',
    sameAs: SITE.artist.sameAs,
  };
}

export function buildImageGalleryJsonLd(
  category: Pick<PortfolioCategory, 'name' | 'slug' | 'description'>,
  items: PortfolioItem[],
  pageUrl: string,
) {
  const sorted = sortPortfolioItems(items);
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `${category.name} — Pablo Pinxit`,
    description: categoryDescription(category.name, category.description),
    url: pageUrl,
    author: { '@type': 'Person', name: SITE.artist.name, url: SITE.url },
    hasPart: sorted.map((item, index) => ({
      '@type': 'ImageObject',
      name: item.title?.trim() || imageAlt(null, category.name, index),
      contentUrl: item.image_url,
      ...(item.description?.trim() ? { description: item.description.trim() } : {}),
    })),
  };
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
