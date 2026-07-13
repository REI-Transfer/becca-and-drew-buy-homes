import Script from "next/script"

// GoFunnel attribution/tracking script. Loads the per-client tracking script
// (org id via NEXT_PUBLIC_GOFUNNEL_ORG_ID, defaulting to this client's id) with
// strategy="beforeInteractive" so it runs ahead of form embeds and sets the
// gf_sid session cookie used for attribution. Set the env var to "" to disable.
const GOFUNNEL_ORG_ID =
  process.env.NEXT_PUBLIC_GOFUNNEL_ORG_ID ?? "9f48659a-b405-4dd2-8e3f-9b6bea7cf3dc"

export function GoFunnelTracking() {
  if (!GOFUNNEL_ORG_ID) return null

  return (
    <Script
      id="gofunnel-tracking"
      src={`https://app.gofunnel.ai/api/tracking/script/${GOFUNNEL_ORG_ID}`}
      strategy="beforeInteractive"
    />
  )
}
