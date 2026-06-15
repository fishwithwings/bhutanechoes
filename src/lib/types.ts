export type Difficulty = 'easy' | 'moderate' | 'challenging' | 'strenuous';
export type TierKey = 'basic' | 'classic' | 'luxury';

export interface TourTier {
  id: string;
  tour_id: string;
  key: TierKey;
  label: string;    // "Essential", "Classic", "Luxury"
  tagline: string;
  price_cents: number;
  includes: string[];
  sort_order: number;
}
export type GuideStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type BookingStatus =
  | 'pending' | 'paid' | 'cancelled' | 'completed' | 'refunded';

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface MapPoint {
  lat: number;
  lng: number;
  label: string;
}

export interface Tour {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  description: string | null;
  duration_days: number;
  difficulty: Difficulty;
  region: string | null;
  min_price_cents: number;
  max_price_cents: number;
  max_group_size: number;
  image_url: string | null;
  gallery: string[];
  highlights: string[];
  itinerary?: ItineraryDay[];
  map_points?: MapPoint[];
  is_active: boolean;
  sort_order: number;
}

export interface Guide {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  photo_url: string | null;
  languages: string[];
  certifications: string[];
  license_number: string | null;
  years_experience: number;
  status: GuideStatus;
  rejection_reason: string | null;
  stripe_account_id: string | null;
  stripe_onboarding_done: boolean;
}

export interface GuideTour {
  id: string;
  guide_id: string;
  tour_id: string;
  price_cents?: number | null; // deprecated — tiers drive pricing now
  is_active: boolean;
}

export interface Review {
  id: string;
  guide_id: string;
  booking_id?: string | null;
  author_name: string;
  rating: number;
  comment: string | null;
  is_published?: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  tour_id: string;
  guide_id: string;
  guest_name: string;
  guest_email: string;
  tour_date: string;
  group_size: number;
  tier_key: TierKey;
  unit_price_cents: number;
  total_price_cents: number;
  commission_cents: number;
  guide_payout_cents: number;
  commission_pct: number;
  currency: string;
  status: BookingStatus;
  created_at: string;
}
