/**
 * lib/service-area.ts — single geo gate for every address input.
 *
 * An address passes when:
 *   1. its state is NOT in NEXT_PUBLIC_EXCLUDED_STATES ("OH,OK,PA"), and
 *   2. its "ST:City" locality is NOT in NEXT_PUBLIC_EXCLUDED_LOCALITIES ("IL:Chicago"), and
 *   3. it falls inside a SERVICE_AREAS circle OR its "ST:County" is in
 *      NEXT_PUBLIC_ALLOWED_COUNTIES ("MD:Howard County,VA:Loudoun County").
 * With no circles and no counties configured, step 3 passes (no restriction),
 * so an empty config keeps the old nationwide behavior.
 *
 * NEXT_PUBLIC_* are inlined at build time: changing them needs a redeploy.
 */

export interface ServiceArea {
  id: string
  centerLat: number
  centerLng: number
  radiusMiles: number
}

export interface GeoInput {
  lat?: number
  lng?: number
  state?: string // short_name, e.g. "MD"
  city?: string // locality long_name
  county?: string // administrative_area_level_2 long_name
}

export interface GeoRules {
  allowedCounties: string[]
  excludedStates: string[]
  excludedLocalities: string[]
}

const norm = (s: string) =>
  s
    .replace(/[‘’ʼ]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()

const parseList = (raw: string | undefined) =>
  (raw ?? "")
    .split(",")
    .map(norm)
    .filter(Boolean)

export const geoRulesFromEnv: GeoRules = {
  allowedCounties: parseList(process.env.NEXT_PUBLIC_ALLOWED_COUNTIES),
  excludedStates: parseList(process.env.NEXT_PUBLIC_EXCLUDED_STATES),
  excludedLocalities: parseList(process.env.NEXT_PUBLIC_EXCLUDED_LOCALITIES),
}

export function haversineDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Ignore malformed entries (e.g. ["StateName"] from the onboarding tool) so a bad
// SERVICE_AREAS value never blocks selection on its own.
export function validAreas(areas: ServiceArea[] | undefined): ServiceArea[] {
  return (areas ?? []).filter(
    a => typeof a?.centerLat === "number" && typeof a?.centerLng === "number" && typeof a?.radiusMiles === "number",
  )
}

export function isAddressAllowed(geo: GeoInput, areas: ServiceArea[] | undefined, rules: GeoRules = geoRulesFromEnv): boolean {
  const state = norm(geo.state ?? "")
  if (state && rules.excludedStates.includes(state)) return false

  const city = norm(geo.city ?? "")
  if (state && city && rules.excludedLocalities.includes(`${state}:${city}`)) return false

  const circles = validAreas(areas)
  if (circles.length === 0 && rules.allowedCounties.length === 0) return true

  const county = norm(geo.county ?? "")
  if (state && county && rules.allowedCounties.includes(`${state}:${county}`)) return true

  if (circles.length > 0) {
    // No geometry from Places: keep the previous fail-open behavior for circles.
    if (geo.lat === undefined || geo.lng === undefined) return true
    return circles.some(a => haversineDistanceMiles(geo.lat!, geo.lng!, a.centerLat, a.centerLng) <= a.radiusMiles)
  }
  return false
}
