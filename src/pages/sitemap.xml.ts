import type { APIRoute } from 'astro';
import { getTours } from '../lib/data';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env;
  const tours = await getTours(env);

  const base = 'https://bhutanechoes.com';
  const now = new Date().toISOString().split('T')[0];

  const staticUrls = [
    '/', '/tours', '/about', '/for-guides', '/travel-guide',
    '/travel-guide/bhutan-visa-sdf-fee-explained',
    '/travel-guide/best-time-to-visit-bhutan',
    '/plan',
  ].map((p) => `
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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...tourUrls].join('')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
