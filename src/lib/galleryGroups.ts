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

/**
 * Narrative walk order within a location group (left-to-right along the wall).
 * Keys match extractGroupKey() output. Detail strings match the title suffix after " · ".
 */
const GROUP_WALK_ORDER: Record<string, string[]> = {
  '8 donne straordinarie Milano': [
    'Via Tranquillo Cremona',
    'Rosa Genoni, Sibilla Aleramo',
    'Anna Kuliscioff, Ada Negri',
    'floral detail, Casa Majno',
    'Alessandrina Ravizza, Maria Montessori',
    'Ersilia Bronzini Majno, Laura Solera Mantegazza',
  ],
};

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

const TITLE_SEPARATOR = /\s+[·•|—–]\s+/;

/** CRM titles may append a panel detail after a separator; strip for location grouping. */
function stripTitleDetailSuffix(title: string): string {
  const match = title.match(/^(.+?)\s+[·•|—–]\s+/);
  return match ? match[1].trim() : title;
}

/** Detail segment after the location prefix (e.g. "Rosa Genoni, Sibilla Aleramo"). */
function getTitleDetailPart(title: string | undefined): string {
  if (!title?.trim()) return '';
  const parts = title.trim().split(TITLE_SEPARATOR);
  if (parts.length < 2) return '';
  if (parts.length >= 3 && /^\d+$/.test(parts[1].trim())) {
    return parts.slice(2).join(' · ').trim();
  }
  return parts.slice(1).join(' · ').trim();
}

/** Optional hidden walk index: "Mural · 2 · detail" → 2 (stripped from display). */
export function parseWalkOrderFromTitle(title: string | undefined): number | null {
  if (!title?.trim()) return null;
  const parts = title.trim().split(TITLE_SEPARATOR);
  if (parts.length >= 3 && /^\d+$/.test(parts[1].trim())) {
    return Number.parseInt(parts[1], 10);
  }
  return null;
}

export function imageHasWalkIndex(title: string | undefined): boolean {
  return parseWalkOrderFromTitle(title) !== null;
}

function walkOrderIndex(groupId: string, detail: string): number {
  const steps = GROUP_WALK_ORDER[groupId];
  if (!steps || !detail) return Number.MAX_SAFE_INTEGER;
  const normalized = detail.toLowerCase();
  const idx = steps.findIndex((step) => normalized.includes(step.toLowerCase()));
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

function sortImagesByWalkOrder(images: GalleryImage[], groupId: string): GalleryImage[] {
  const hasWalkConfig =
    GROUP_WALK_ORDER[groupId] ||
    images.some((img) => parseWalkOrderFromTitle(img.title ?? '') !== null);
  if (!hasWalkConfig) return images;

  return [...images].sort((a, b) => {
    const walkA = parseWalkOrderFromTitle(a.title ?? '');
    const walkB = parseWalkOrderFromTitle(b.title ?? '');
    if (walkA !== null && walkB !== null) return walkA - walkB;
    if (walkA !== null) return -1;
    if (walkB !== null) return 1;

    const idxA = walkOrderIndex(groupId, getTitleDetailPart(a.title));
    const idxB = walkOrderIndex(groupId, getTitleDetailPart(b.title));
    if (idxA !== idxB) return idxA - idxB;
    return (a.src ?? '').localeCompare(b.src ?? '');
  });
}

/** True when a location group has walk order (CRM index or legacy code list). */
export function hasGroupWalkOrder(
  groupId: string,
  images: GalleryImage[] = [],
): boolean {
  if (Object.hasOwn(GROUP_WALK_ORDER, groupId)) return true;
  return images.some(
    (img) =>
      extractGroupKey(img.title) === groupId && imageHasWalkIndex(img.title),
  );
}

/** Use row-based grid when filtering a location with a narrative walk sequence. */
export function shouldUseSequentialGrid(
  images: GalleryImage[],
  activeGroup: string | null,
): boolean {
  if (!activeGroup) return false;
  return hasGroupWalkOrder(activeGroup, images);
}

/** Cluster by location; within each group apply walk order; preserve group order from CRM list. */
function sortAllGalleryImages(
  images: GalleryImage[],
  categoryTitle?: string,
): GalleryImage[] {
  const groupMap = new Map<string, GalleryImage[]>();
  const groupFirstIndex = new Map<string, number>();

  images.forEach((img, index) => {
    const key = extractGroupKey(img.title, categoryTitle) ?? UNCategorized;
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
      groupFirstIndex.set(key, index);
    }
    groupMap.get(key)!.push(img);
  });

  return [...groupMap.entries()]
    .sort(
      (a, b) =>
        (groupFirstIndex.get(a[0]) ?? 0) - (groupFirstIndex.get(b[0]) ?? 0),
    )
    .flatMap(([groupId, groupImages]) =>
      sortImagesByWalkOrder(groupImages, groupId),
    );
}

/** Title for hover/lightbox — hides optional " · N · " walk index. */
export function formatDisplayTitle(title: string | undefined): string {
  if (!title?.trim()) return '';
  const parts = title.trim().split(TITLE_SEPARATOR);
  if (parts.length >= 3 && /^\d+$/.test(parts[1].trim())) {
    return [parts[0], ...parts.slice(2)].join(' · ').trim();
  }
  return title.trim();
}

/** Derive a location/group label from a CRM image title. */
export function extractGroupKey(title: string | null | undefined, categoryTitle?: string): string | null {
  if (!title?.trim()) return UNCategorized;

  const t = stripTitleDetailSuffix(title.trim());
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
  if (groups.length < 2 || groups.length > 50) return false;
  const meaningful = groups.filter((g) => g.id !== UNCategorized);
  return meaningful.length >= 2;
}

export function filterImagesByGroup(
  images: GalleryImage[],
  groupId: string | null,
  categoryTitle?: string,
): GalleryImage[] {
  if (!groupId) return sortAllGalleryImages(images, categoryTitle);
  const filtered = images.filter(
    (img) => extractGroupKey(img.title, categoryTitle) === groupId,
  );
  return sortImagesByWalkOrder(filtered, groupId);
}

export { slugify as groupSlug };
