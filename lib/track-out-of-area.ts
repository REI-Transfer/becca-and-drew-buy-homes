// Counts addresses the form turns away as "outside our buying area".
// Before this, a rejected seller left no trace anywhere, so a geo setting that
// blocked real leads was invisible. Fires once per address:
//   - Meta pixel custom event "OutOfArea" (state + city), countable in Events Manager.
//     Custom events do not affect the campaign, which optimizes on Lead.
//   - Clarity event "out_of_area" + tag, so recordings can be filtered to these visits.
// No street address or contact details are sent.
const seen = new Set<string>()

type Geo = { state?: string; city?: string; county?: string }

export function trackOutOfArea(address: string, geo: Geo = {}) {
  if (typeof window === "undefined") return
  const key = address.trim().toLowerCase()
  if (!key || seen.has(key)) return
  seen.add(key)

  const state = (geo.state || "").toUpperCase()
  const city = geo.city || ""
  const w = window as unknown as {
    fbq?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
  }
  try {
    w.fbq?.("trackCustom", "OutOfArea", { state, city, county: geo.county || "" })
  } catch {}
  try {
    w.clarity?.("event", "out_of_area")
    if (state) w.clarity?.("set", "out_of_area_state", state)
  } catch {}
}
