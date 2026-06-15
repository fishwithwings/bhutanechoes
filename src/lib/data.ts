import { publicClient } from './supabase';
import type { Tour, Guide, GuideTour, Review, TourTier, TierKey } from './types';
import {
  SEED_TOURS, SEED_GUIDES, SEED_GUIDE_TOURS, SEED_REVIEWS, SEED_TIERS,
} from './seed-data';

/**
 * Read-side data access for public pages. Each function tries Supabase first and
 * silently falls back to bundled seed data if Supabase isn't configured or the
 * query fails — so the site always renders. `env` is the Cloudflare runtime bag
 * (Astro.locals.runtime?.env); pass it through from pages.
 */

type Env = Record<string, string | undefined> | undefined;

function db(env: Env) {
  try {
    return publicClient(env);
  } catch {
    return null; // env not set -> use seed
  }
}

export interface GuideWithRating extends Guide {
  rating: number;
  review_count: number;
}

/** @deprecated use GuideWithRating — price is now on the tier */
export type GuideWithPrice = GuideWithRating & { price_cents: number };

function ratingFor(reviews: Review[], guideId: string) {
  const rs = reviews.filter((r) => r.guide_id === guideId);
  if (!rs.length) return { rating: 0, review_count: 0 };
  return {
    rating: rs.reduce((s, r) => s + r.rating, 0) / rs.length,
    review_count: rs.length,
  };
}

export async function getTours(env?: Env): Promise<Tour[]> {
  const client = db(env);
  if (client) {
    const { data, error } = await client
      .from('tours').select('*, tour_tiers(price_cents)').eq('is_active', true).order('sort_order');
    if (!error && data) {
      return (data as any[]).map((t) => {
        const prices: number[] = (t.tour_tiers ?? []).map((tt: any) => tt.price_cents).filter((p: number) => p > 0);
        return {
          ...t,
          min_price_cents: prices.length ? Math.min(...prices) : t.min_price_cents,
        } as Tour;
      });
    }
  }
  return [...SEED_TOURS].sort((a, b) => a.sort_order - b.sort_order);
}

export async function getTourBySlug(slug: string, env?: Env): Promise<Tour | null> {
  const client = db(env);
  if (client) {
    const { data, error } = await client
      .from('tours').select('*').eq('slug', slug).maybeSingle();
    if (!error && data) return data as Tour;
  }
  return SEED_TOURS.find((t) => t.slug === slug) ?? null;
}

/** Approved guides offering a given tour, with their rating. */
export async function getGuidesForTour(tourId: string, env?: Env): Promise<GuideWithPrice[]> {
  const client = db(env);
  if (client) {
    const { data, error } = await client
      .from('guide_tours')
      .select('guides!inner(*)')
      .eq('tour_id', tourId)
      .eq('is_active', true)
      .eq('guides.status', 'approved');
    if (!error && data) {
      const guideIds = data.map((r: any) => r.guides.id);
      const { data: revs } = await client
        .from('reviews').select('guide_id, rating').in('guide_id', guideIds);
      return data.map((r: any) => ({
        ...(r.guides as Guide),
        price_cents: 0,
        ...ratingFor((revs ?? []) as Review[], r.guides.id),
      }));
    }
  }
  // seed fallback
  return SEED_GUIDE_TOURS
    .filter((gt) => gt.tour_id === tourId && gt.is_active)
    .map((gt) => {
      const g = SEED_GUIDES.find((x) => x.id === gt.guide_id)!;
      return { ...g, price_cents: 0, ...ratingFor(SEED_REVIEWS, g.id) };
    })
    .filter((g) => g.status === 'approved');
}

export async function getApprovedGuides(env?: Env): Promise<GuideWithPrice[]> {
  const client = db(env);
  if (client) {
    const { data, error } = await client
      .from('guides').select('*').eq('status', 'approved');
    if (!error && data) {
      const { data: revs } = await client.from('reviews').select('guide_id, rating');
      return (data as Guide[]).map((g) => ({
        ...g, price_cents: 0, ...ratingFor((revs ?? []) as Review[], g.id),
      }));
    }
  }
  return SEED_GUIDES
    .filter((g) => g.status === 'approved')
    .map((g) => ({ ...g, price_cents: 0, ...ratingFor(SEED_REVIEWS, g.id) }));
}

export interface GuideProfile {
  guide: Guide;
  tours: (GuideTour & { tour: Tour })[];
  reviews: Review[];
  rating: number;
  review_count: number;
}

export async function getGuideBySlug(slug: string, env?: Env): Promise<GuideProfile | null> {
  const client = db(env);
  if (client) {
    const { data: g } = await client
      .from('guides').select('*').eq('slug', slug).eq('status', 'approved').maybeSingle();
    if (g) {
      const { data: gts } = await client
        .from('guide_tours').select('*, tour:tours(*)').eq('guide_id', g.id).eq('is_active', true);
      const { data: revs } = await client
        .from('reviews').select('*').eq('guide_id', g.id).eq('is_published', true)
        .order('created_at', { ascending: false });
      const { rating, review_count } = ratingFor((revs ?? []) as Review[], g.id);
      return {
        guide: g as Guide,
        tours: (gts ?? []) as any,
        reviews: (revs ?? []) as Review[],
        rating, review_count,
      };
    }
  }
  // seed fallback
  const g = SEED_GUIDES.find((x) => x.slug === slug && x.status === 'approved');
  if (!g) return null;
  const tours = SEED_GUIDE_TOURS
    .filter((gt) => gt.guide_id === g.id && gt.is_active)
    .map((gt) => ({ ...gt, tour: SEED_TOURS.find((t) => t.id === gt.tour_id)! }));
  const reviews = SEED_REVIEWS.filter((r) => r.guide_id === g.id);
  return { guide: g, tours, reviews, ...ratingFor(SEED_REVIEWS, g.id) };
}

export interface Offering {
  tour: Tour;
  guide: Guide;
  price_cents: number;
  tier: TourTier;
}

/** All tiers for a tour, sorted. */
export async function getTiersForTour(tourId: string, env?: Env): Promise<TourTier[]> {
  const client = db(env);
  if (client) {
    const { data, error } = await client
      .from('tour_tiers').select('*').eq('tour_id', tourId).order('sort_order');
    if (!error && data) return data as TourTier[];
  }
  return SEED_TIERS.filter((t) => t.tour_id === tourId).sort((a, b) => a.sort_order - b.sort_order);
}

/** A specific guide + tour + tier by slugs — for the booking page. */
export async function getOffering(
  tourSlug: string, guideSlug: string, tierKey: TierKey, env?: Env,
): Promise<Offering | null> {
  const client = db(env);
  if (client) {
    const { data: tour } = await client
      .from('tours').select('*').eq('slug', tourSlug).maybeSingle();
    const { data: guide } = await client
      .from('guides').select('*').eq('slug', guideSlug).eq('status', 'approved').maybeSingle();
    if (tour && guide) {
      const { data: gt } = await client
        .from('guide_tours').select('id')
        .eq('tour_id', tour.id).eq('guide_id', guide.id).eq('is_active', true).maybeSingle();
      if (!gt) return null;
      const { data: tier } = await client
        .from('tour_tiers').select('*')
        .eq('tour_id', tour.id).eq('key', tierKey).maybeSingle();
      if (!tier) return null;
      return { tour: tour as Tour, guide: guide as Guide, price_cents: tier.price_cents, tier: tier as TourTier };
    }
    return null;
  }
  // seed fallback
  const tour = SEED_TOURS.find((t) => t.slug === tourSlug);
  const guide = SEED_GUIDES.find((g) => g.slug === guideSlug && g.status === 'approved');
  if (!tour || !guide) return null;
  const gt = SEED_GUIDE_TOURS.find((x) => x.tour_id === tour.id && x.guide_id === guide.id && x.is_active);
  if (!gt) return null;
  const tier = SEED_TIERS.find((t) => t.tour_id === tour.id && t.key === tierKey);
  if (!tier) return null;
  return { tour, guide, price_cents: tier.price_cents, tier };
}

/** A few published 4-5 star reviews for the homepage social-proof section. */
export async function getFeaturedReviews(env?: Env): Promise<(Review & { guide_name?: string })[]> {
  const client = db(env);
  if (client) {
    const { data, error } = await client
      .from('reviews')
      .select('*, guide:guides(name)')
      .eq('is_published', true)
      .gte('rating', 4)
      .order('created_at', { ascending: false })
      .limit(3);
    if (!error && data) return (data as any[]).map((r) => ({ ...r, guide_name: r.guide?.name }));
  }
  // seed fallback — return top 3 seed reviews
  return SEED_REVIEWS
    .filter((r) => r.is_published && r.rating >= 4)
    .slice(0, 3)
    .map((r) => {
      const g = SEED_GUIDES.find((x) => x.id === r.guide_id);
      return { ...r, guide_name: g?.name };
    });
}

/** Map of tourId -> count of approved guides (for listing cards). */
export async function getGuideCounts(env?: Env): Promise<Record<string, number>> {
  const client = db(env);
  if (client) {
    const { data } = await client
      .from('guide_tours').select('tour_id, guides!inner(status)').eq('is_active', true)
      .eq('guides.status', 'approved');
    if (data) {
      const m: Record<string, number> = {};
      for (const r of data as any[]) m[r.tour_id] = (m[r.tour_id] ?? 0) + 1;
      return m;
    }
  }
  const m: Record<string, number> = {};
  for (const gt of SEED_GUIDE_TOURS) {
    const g = SEED_GUIDES.find((x) => x.id === gt.guide_id);
    if (gt.is_active && g?.status === 'approved') m[gt.tour_id] = (m[gt.tour_id] ?? 0) + 1;
  }
  return m;
}
