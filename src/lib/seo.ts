import type { PortfolioCategory, PortfolioItem } from './crm';

export const STATIC_CATEGORY_ROUTES = new Set(['videos', 'arts-books']);

export const STATIC_HOME_TILES = [
  { name: 'Videos', slug: 'videos', coverImage: '/Videos/videos.jpg' },
  { name: 'Arts Books', slug: 'arts-books', coverImage: '/Arts Books/BooksPortada.jpg' },
] as const;

export const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/about', changefreq: 'monthly', priority: 0.8 },
  { path: '/contact', changefreq: 'monthly', priority: 0.8 },
  { path: '/videos', changefreq: 'monthly', priority: 0.75 },
  { path: '/arts-books', changefreq: 'monthly', priority: 0.75 },
] as const;

export const SITE = {
  name: 'Pablo Pinxit',
  url: 'https://pablopinxit.com',
  brandImage: '/favicon.webp',
  locale: 'en_US',
  language: 'en',
  defaultDescription:
    'Official portfolio of Pablo Pinxit (Pablo Compagnucci) — Argentine-Italian visual artist. Murals, pictorial collage, street art and mixed media across Milano, Italy and beyond.',
  defaultKeywords:
    'Pablo Pinxit, Pablo Compagnucci, visual artist, street art, murals, pictorial collage, Milano, contemporary art, portfolio',
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
    knowsAbout: [
      'Pictorial collage',
      'Street art',
      'Murals',
      'Mixed media',
      'Contemporary art',
    ],
  },
} as const;

const CATEGORY_SEO: Record<
  string,
  { subtitle: string; description: string }
> = {
  walls: {
    subtitle: 'Murals & Wall Art',
    description:
      'Murals and large-scale wall works by Pablo Pinxit in Milano, Napoli, Urbino and public spaces — pictorial collage interventions and street art.',
  },
  shutters: {
    subtitle: 'Shutters & Urban Collage',
    description:
      'Pictorial collage on shutters and urban surfaces by Pablo Pinxit — layered imagery exploring boundaries, memory and the city.',
  },
  dadapop: {
    subtitle: 'Dadapop Series',
    description:
      'Dadapop — a series of pictorial collage works by Pablo Pinxit blending pop culture, Dada spirit and urban visual language.',
  },
  ikons: {
    subtitle: 'Ikons & Sacred Imagery',
    description:
      'Ikons by Pablo Pinxit — contemporary pictorial collage reimagining sacred and symbolic imagery through mixed media.',
  },
  hybris: {
    subtitle: 'Hybris Collection',
    description:
      'Hybris — pictorial collage and mixed media works by Pablo Pinxit, including collaborations and artist book projects.',
  },
  'mind-blowing-garden': {
    subtitle: 'Mind Blowing Garden',
    description:
      'Mind Blowing Garden — an immersive pictorial collage series by Pablo Pinxit where nature, architecture and imagination converge.',
  },
};

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, SITE.url).href;
}

export function truncate(text: string, max = 160): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const cut = trimmed.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

export function imageAlt(
  title: string | null | undefined,
  categoryName: string,
  index?: number,
): string {
  const cleaned = title?.trim();
  if (cleaned && !/^foto\s+\d+/i.test(cleaned)) {
    return `${cleaned} — Pablo Pinxit`;
  }
  if (index !== undefined) {
    return `${categoryName} artwork ${index + 1} by Pablo Pinxit`;
  }
  return `${categoryName} — Pablo Pinxit`;
}

export function categorySeo(slug: string, name: string) {
  return (
    CATEGORY_SEO[slug] ?? {
      subtitle: 'Gallery',
      description: `Explore ${name}, a collection of visual art by Pablo Pinxit — Argentine-Italian artist working in pictorial collage, street art and mixed media.`,
    }
  );
}

export function categoryTitle(name: string, slug: string): string {
  const { subtitle } = categorySeo(slug, name);
  return `${name} — ${subtitle} | Pablo Pinxit`;
}

export function categoryDescription(
  name: string,
  slug: string,
  description: string | null,
): string {
  if (description?.trim()) return truncate(description.trim());
  return truncate(categorySeo(slug, name).description);
}

export function coverAlt(categoryName: string): string {
  return `${categoryName} — Pablo Pinxit portfolio gallery`;
}

export function sortPortfolioItems(items: PortfolioItem[]): PortfolioItem[] {
  return [...items].sort((a, b) => b.sort_order - a.sort_order);
}

/** Exclude cover image when duplicated as a portfolio item in the gallery. */
export function filterGalleryItems(
  items: PortfolioItem[],
  coverImage: string | null,
  categoryName: string,
): PortfolioItem[] {
  const nameMatch = categoryName.trim().toLowerCase();

  return items.filter((item) => {
    if (coverImage && item.image_url === coverImage) return false;
    const title = item.title?.trim().toLowerCase();
    if (title && title === nameMatch) return false;
    return true;
  });
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.defaultDescription,
    inLanguage: SITE.language,
    publisher: { '@id': `${SITE.url}/#person` },
  };
}

export function buildPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}/#person`,
    name: SITE.artist.name,
    alternateName: SITE.artist.legalName,
    url: SITE.url,
    email: SITE.artist.email,
    birthPlace: { '@type': 'Place', name: SITE.artist.birthPlace },
    birthDate: `${SITE.artist.birthYear}-01-01`,
    jobTitle: 'Visual Artist',
    description:
      'Argentine-Italian visual artist working in pictorial collage, street art and mixed media. Exhibited in galleries and museums internationally.',
    sameAs: SITE.artist.sameAs,
    knowsAbout: SITE.artist.knowsAbout,
  };
}

export function buildHomeItemListJsonLd(
  categories: Pick<PortfolioCategory, 'name' | 'slug' | 'cover_image'>[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pablo Pinxit Portfolio Galleries',
    numberOfItems: categories.length,
    itemListElement: categories.map((cat, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: cat.name,
      url: absoluteUrl(`/${cat.slug}`),
      ...(cat.cover_image ? { image: cat.cover_image } : {}),
    })),
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
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
    '@id': `${pageUrl}#gallery`,
    name: categoryTitle(category.name, category.slug),
    description: categoryDescription(
      category.name,
      category.slug,
      category.description,
    ),
    url: pageUrl,
    inLanguage: SITE.language,
    author: { '@id': `${SITE.url}/#person` },
    isPartOf: { '@id': `${SITE.url}/#website` },
    numberOfItems: sorted.length,
    hasPart: sorted.map((item, index) => ({
      '@type': 'ImageObject',
      name: item.title?.trim() || imageAlt(null, category.name, index),
      contentUrl: item.image_url,
      ...(item.description?.trim()
        ? { description: item.description.trim() }
        : {}),
      creator: { '@id': `${SITE.url}/#person` },
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

export function buildPageSitemapXml(
  entries: { loc: string; lastmod: string; changefreq: string; priority: number }[],
): string {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${escapeXml(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}
