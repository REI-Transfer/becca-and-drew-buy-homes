/**
 * lib/thank-you-videos.ts -- Static manifest for the /thank-you video gallery.
 *
 * Source of truth: the Becca-and-drew Vercel Blob store, folder `new-thank-you/`.
 * Pathnames below were generated ONCE from a @vercel/blob list() call and hardcoded
 * here -- there is intentionally NO list() at runtime or build time. If videos are
 * added/removed/renamed in the blob, regenerate this file.
 *
 * `file` holds the RAW (un-encoded) blob pathname (incl. the "new-thank-you/" prefix).
 * The gallery component encodes it per-segment when building the URL, so it MUST stay
 * raw here -- including the irregular multi-space runs and the curly apostrophes (U+2019).
 *
 * Flat ordered sequence -- Edit 1 Revision, 2, 3, 4 Revision, 5, 6, 7, 8. No categories.
 */

export interface VideoEntry {
  title: string
  /** Raw blob pathname (includes the "new-thank-you/" prefix). */
  file: string
}

export const VIDEOS: VideoEntry[] = [
  {
    title: "Who We Are (And Why That Matters)",
    file: "new-thank-you/(Edit 1 Revision)  Who We Are (And Why That Matters).mp4",
  },
  {
    title: "Real Stories From Homeowners We’ve Helped",
    file: "new-thank-you/(Edit 2) Real Stories From Homeowners We’ve Helped.mp4",
  },
  {
    title: "How We Determine Value",
    file: "new-thank-you/(Edit 3) How We Determine Value.mp4",
  },
  {
    title: "What If You Don’t Like The Offer",
    file: "new-thank-you/(Edit 4 Revision)    What If You Don’t Like The Offer.mp4",
  },
  {
    title: "We Aren’t The Right Fit For Everyone",
    file: "new-thank-you/(Edit 5)  We Aren’t The Right Fit For Everyone.mp4",
  },
  {
    title: "What Happens Next",
    file: "new-thank-you/(Edit 6)  What Happens Next.mp4",
  },
  {
    title: "Selling Directly vs. Listing Traditionally",
    file: "new-thank-you/(Edit 7)   Selling Directly vs. Listing Traditionally.mp4",
  },
  {
    title: "Three Things To Have Ready Before We Talk",
    file: "new-thank-you/(Edit 8)  Three Things To Have Ready Before We Talk.mp4",
  },
]
