"use client";

import NextTopLoader from "nextjs-toploader";

/**
 * App-wide top progress bar (nprogress via nextjs-toploader).
 * Starts on same-origin <Link> / <a> navigations and finishes when the route settles.
 */
export default function TopProgressBar() {
  return (
    <NextTopLoader
      color="#c85a32"
      initialPosition={0.18}
      crawlSpeed={180}
      height={3}
      crawl
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 2px 8px rgba(200, 90, 50, 0.35)"
      zIndex={99999}
      showAtBottom={false}
    />
  );
}
