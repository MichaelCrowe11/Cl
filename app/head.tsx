/**
 * Global <head> for the Next.js App Router.
 *
 * We inject a tiny inline script that defines `window.chrome`
 * and `window.ethereum` **immediately** so any wallet helper
 * loaded later won’t complain about missing browser-extension APIs.
 *
 * NOTE: This file is rendered on the server, so we use
 * `dangerouslySetInnerHTML` to avoid referencing `window` directly.
 */
export default function Head() {
  return (
    <>
      {/* Existing meta tags can stay in app/layout.tsx – this just runs earlier */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // MetaMask / wallet-helper polyfill
            window.chrome = window.chrome || {};
            window.ethereum = window.ethereum || {};
          `,
        }}
      />
    </>
  )
}
