import type { APIRoute } from 'astro';
import { getTours, getApprovedGuides } from '../lib/data';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env;
  const [tours, guides] = await Promise.all([getTours(env), getApprovedGuides(env)]);

  const base = 'https://bhutanechoes.com';
  const now = new Date().toISOString().split('T')[0];

  const staticUrls = ['/', '/tours', '/guides', '/about', '/for-guides'].map((p) => `
  <url>
    <loc>${base}${p}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p === '/' ? '1.0' : '0.8'}</priority>
  </url>`);

  const tourUrls = tours.map((t) => `
  <url>
    <loc>${base}/tours/${t.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);

  const guideUrls = guides.map((g) => `
  <url>
    <loc>${base}/guides/${g.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...tourUrls, ...guideUrls].join('')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
