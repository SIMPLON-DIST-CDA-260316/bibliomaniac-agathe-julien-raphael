export type DiscoveryCategory =
  | 'borrowed'
  | 'recommended_for_you'
  | 'global_recommendations'
  | 'new_releases'

export type BookShelfCategory =
  | 'reading_now'
  | 'borrowed_shelf'
  | 'to_read'
  | 'favorites'
  | 'have_read'
  | 'reviewed'
  | 'recently_viewed'

export const DISCOVERY_LABELS: Record<DiscoveryCategory, string> = {
  borrowed: 'Empruntés',
  recommended_for_you: 'Recommandés pour vous',
  global_recommendations: 'Recommandations globales',
  new_releases: 'Nouveautés',
}

export const DISCOVERY_SLUGS = {
  borrowed: 'empruntes',
  recommended_for_you: 'recommandes-pour-vous',
  global_recommendations: 'recommandations-globales',
  new_releases: 'nouveautes',
} as const satisfies Record<DiscoveryCategory, string>

export const DISCOVERY_ORDER: DiscoveryCategory[] = [
  'borrowed',
  'recommended_for_you',
  'global_recommendations',
  'new_releases',
]

export const discoveryToSlug = (category: DiscoveryCategory): string =>
  DISCOVERY_SLUGS[category]

export function slugToDiscovery(slug: string): DiscoveryCategory | undefined {
  return DISCOVERY_ORDER.find((c) => DISCOVERY_SLUGS[c] === slug)
}
