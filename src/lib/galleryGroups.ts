export const UNCategorized = '__uncategorized__';

export interface GalleryImage {
  src: string;
  title?: string;
  alt?: string;
  description?: string;
}

export interface GalleryGroup {
  id: string;
  label: string;
  count: number;
}

const LOCATION_PREFIXES = [
  'Mural Ospedale Santa Maria Della Misericordia Urbino',
  'Mural Show Room Plh Via Voghera Milano',
  'Piazza Pino Daniele Oliveto Citra',
  'Ponte Piazzale Corvetto Milano',
  'Quartiere Adriano',
  'Tunnel Via Padova',
  'Naviglio Martesana Milano',
  'Parco Trotter Milano',
  'Scuola Russo Milano',
  'Scuola Baccone Milano',
  'Casa Platform Milano',
  'Hotel Ramada Milano',
  'Via Meucci Milano',
  'Via Mosso Milano',
  'Via Esterle Milano',
  'Piazza Segrino Milano',
  'Via Solera Mantegazza Milano',
  'Via Solera Mantecazza Milano',
  'Viale Lombardia Milano',
  'Via Venini Milano',
  'Via Solferino Milano',
  'Studio Milano',
  'Oliveto Citra',
  'Mural A Scampia Napoli',
  'Mural A Crescenzago Milano',
  'Mural A Corsico Milano',
  'Mural Scuola Rossi',
  'Mural A Giussano',
].sort((a, b) => b.length - a.length);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripTrailingNumber(title: string): string {
  return title.replace(/\s+\d+$/, '').trim();
}

/** Derive a location/group label from a CRM image title. */
export function extractGroupKey(title: string | null | undefined, categoryTitle?: string): string | null {
  if (!title?.trim()) return UNCategorized;

  const t = title.trim();
  const cat = categoryTitle?.trim().toLowerCase();

  if (t.startsWith('Foto ')) return UNCategorized;
  if (cat && t.toLowerCase() === cat) return null;

  let base = stripTrailingNumber(t);
  if (!base) return UNCategorized;

  for (const prefix of LOCATION_PREFIXES) {
    if (base.startsWith(prefix)) return prefix;
  }

  if (base.startsWith('Mural A ')) {
    return base.split(/\s+/).slice(0, 4).join(' ');
  }

  if (base.startsWith('Mural ')) {
    const match = base.match(/^(Mural .+?(?:Milano|Napoli|Urbino|Giussano|Rossi))/i);
    if (match) return match[1].trim();
    return base.split(/\s+/).slice(0, 5).join(' ');
  }

  const viaMilano = base.match(/^(Via (?:\S+\s+){0,3}Milano)/);
  if (viaMilano) return viaMilano[1].trim();

  const quartiere = base.match(/^(Quartiere \S+)/);
  if (quartiere) return quartiere[1];

  const tunnel = base.match(/^(Tunnel .+)/);
  if (tunnel) return stripTrailingNumber(tunnel[1]);

  const ponte = base.match(/^(Ponte .+)/);
  if (ponte) return stripTrailingNumber(ponte[1]);

  const piazza = base.match(/^(Piazza .+)/);
  if (piazza) return stripTrailingNumber(piazza[1]);

  return base;
}

export function groupLabel(id: string): string {
  if (id === UNCategorized) return 'Sin categoría';
  return id;
}

export function buildGalleryGroups(
  images: GalleryImage[],
  categoryTitle?: string,
): GalleryGroup[] {
  const counts = new Map<string, number>();

  for (const img of images) {
    const key = extractGroupKey(img.title, categoryTitle);
    if (key === null) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([id, count]) => ({ id, label: groupLabel(id), count }))
    .sort((a, b) => {
      if (a.id === UNCategorized) return 1;
      if (b.id === UNCategorized) return -1;
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label, 'it');
    });
}

/** Show filters when grouping is useful (not too fragmented). */
export function shouldShowGalleryFilters(groups: GalleryGroup[]): boolean {
  if (groups.length < 2 || groups.length > 35) return false;
  const meaningful = groups.filter((g) => g.id !== UNCategorized);
  return meaningful.length >= 2;
}

export function filterImagesByGroup(
  images: GalleryImage[],
  groupId: string | null,
  categoryTitle?: string,
): GalleryImage[] {
  if (!groupId) return images;
  return images.filter((img) => extractGroupKey(img.title, categoryTitle) === groupId);
}

export { slugify as groupSlug };
