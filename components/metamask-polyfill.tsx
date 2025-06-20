"use client"

import Script from "next/script"

/**
 * Injects a tiny shim for `window.chrome` and `window.ethereum`
 * at the **earliest possible moment** (before hydration).
 *
 * This silences wallet helpers that complain when MetaMask isn't installed
 * in non-extension environments like Vercel’s preview or Safari.
 */
export default function MetamaskPolyfill() {
  return (
    <Script id="metamask-polyfill" strategy="beforeInteractive">
      {`
        window.chrome = window.chrome || {};
        window.ethereum = window.ethereum || {};
      `}
    </Script>
  )
}
