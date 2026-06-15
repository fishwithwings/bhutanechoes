/** Money + display helpers. All prices are stored as integer US cents. */

export function formatMoney(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function priceRange(minCents: number, maxCents: number): string {
  return `${formatMoney(minCents)} – ${formatMoney(maxCents)}`;
}

export function formatDuration(days: number): string {
  return days === 1 ? '1 day' : `${days} days`;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  challenging: 'Challenging',
  strenuous: 'Strenuous',
};
export const difficultyLabel = (d: string) => DIFFICULTY_LABEL[d] ?? d;

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

/** Commission math — the single source of truth used by the server. */
export function computeBookingTotals(
  unitPriceCents: number,
  groupSize: number,
  commissionPct: number
) {
  const total = unitPriceCents * groupSize;
  const commission = Math.round(total * (commissionPct / 100));
  const payout = total - commission;
  return {
    unit_price_cents: unitPriceCents,
    total_price_cents: total,
    commission_cents: commission,
    guide_payout_cents: payout,
    commission_pct: commissionPct,
  };
}
