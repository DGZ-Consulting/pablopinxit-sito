import type { APIRoute } from 'astro';
import { getCrmPortfolio } from '../lib/crm';
import {
	STATIC_CATEGORY_ROUTES,
	STATIC_PAGES,
	absoluteUrl,
	buildPageSitemapXml,
} from '../lib/seo';

export const GET: APIRoute = async () => {
	const portfolio = await getCrmPortfolio();
	const lastmod = new Date().toISOString();

	const entries = [
		...STATIC_PAGES.map((page) => ({
			loc: absoluteUrl(page.path),
			lastmod,
			changefreq: page.changefreq,
			priority: page.priority,
		})),
		...portfolio
			.filter((cat) => !STATIC_CATEGORY_ROUTES.has(cat.slug))
			.map((cat) => ({
				loc: absoluteUrl(`/${cat.slug}`),
				lastmod,
				changefreq: 'weekly',
				priority: 0.85,
			})),
	];

	return new Response(buildPageSitemapXml(entries), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600',
		},
	});
};
