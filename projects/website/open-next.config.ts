import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Marketing site: every page is prerendered and nothing revalidates. The worker
// still handles each request, and without an incremental cache it renders the
// page again, or, for a route with `dynamicParams = false` (the Ands detail
// pages), finds no prerendered entry and answers 404. The read-only static
// assets cache serves the prerendered output from the Workers assets instead.
// Switch to an R2 incremental cache if ISR is ever introduced.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
