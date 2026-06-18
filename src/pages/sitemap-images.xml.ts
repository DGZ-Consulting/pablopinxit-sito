import type { APIRoute } from 'astro';
import { getCrmPortfolio } from '../lib/crm';
import {
	absoluteUrl,
	categoryDescription,
	escapeXml,
	imageAlt,
	sortPortfolioItems,
	STATIC_CATEGORY_ROUTES,
} from '../lib/seo';

export const GET: APIRoute = async () => {
	const portfolio = await getCrmPortfolio();
	const buildDate = new Date().toISOString();

	const urls = portfolio
		.filter((cat) => cat.items.length > 0 && !STATIC_CATEGORY_ROUTES.has(cat.slug))
		.map((cat) => {
			const pageUrl = absoluteUrl(`/${cat.slug}`);
			const pageCaption = categoryDescription(cat.name, cat.slug, cat.description);
			const images = sortPortfolioItems(cat.items)
				.map((item, index) => {
					const title = imageAlt(item.title, cat.name, index);
					const caption = item.description?.trim() || pageCaption;
					return [
						'    <image:image>',
						`      <image:loc>${escapeXml(item.image_url)}</image:loc>`,
						`      <image:title>${escapeXml(title)}</image:title>`,
						`      <image:caption>${escapeXml(truncateCaption(caption))}</image:caption>`,
						'    </image:image>',
					].join('\n');
				})
				.join('\n');

			return [
				'  <url>',
				`    <loc>${escapeXml(pageUrl)}</loc>`,
				`    <lastmod>${buildDate}</lastmod>`,
				images,
				'  </url>',
			].join('\n');
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600',
		},
	});
};

function truncateCaption(text: string, max = 256): string {
	if (text.length <= max) return text;
	return `${text.slice(0, max - 1).trim()}…`;
}
