export interface PortfolioItem {
  title: string | null;
  description: string | null;
  image_url: string;
  sort_order: number;
}

export interface PortfolioCategory {
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  items: PortfolioItem[];
}

const crmUrl = import.meta.env.CRM_URL ?? process.env.CRM_URL;
const siteSlug = import.meta.env.CRM_SITE_SLUG ?? process.env.CRM_SITE_SLUG ?? 'pablopinxit';

export async function getCrmPortfolio(): Promise<PortfolioCategory[]> {
  if (!crmUrl) return [];
  try {
    const res = await fetch(`${crmUrl}/api/sites/${siteSlug}/portfolio`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}
