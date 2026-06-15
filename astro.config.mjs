import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// Astro on Cloudflare Pages. We use `server` output so dashboards/admin and the
// booking flow can run server-rendered (auth-gated), while static content pages
// (home, tours, tour detail, guide profile) are pre-rendered for SEO via
// `export const prerender = true` in each of those pages.
export default defineConfig({
  output: 'server',
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [tailwind()],
  site: 'https://bhutanechoes.pages.dev',
});
