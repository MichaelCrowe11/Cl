/**
 * Global <head> element – rendered for EVERY route.
 * The inline script runs before any bundled JS, so wallet-detection libraries
 * never see a missing MetaMask extension and the
 * “[ChromeTransport] connectChrome error: MetaMask extension not found” message
 * is completely silenced.
 */
export default function Head() {
  return (
    <>
      {/* -- MetaMask / wallet polyfill ---------------------------------- */}
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
// Wallet-shim – injected at the earliest possible moment
(function () {
  if (typeof window === 'undefined') return;

  // Stub chrome.runtime.connect so "connectChrome" never throws
  window.chrome = window.chrome || {};
  window.chrome.runtime = window.chrome.runtime || {
    connect: () => ({
      postMessage() {},
      disconnect() {},
      onMessage: { addListener() {}, removeListener() {} },
      onDisconnect: { addListener() {}, removeListener() {} },
    }),
    sendMessage: () => Promise.resolve(null),
    onMessage: { addListener() {}, removeListener() {} },
    onConnect: { addListener() {}, removeListener() {} },
  };

  // Stub ethereum provider
  window.ethereum = window.ethereum || {
    isMetaMask: false,
    isConnected: () => false,
    request: () => Promise.reject(new Error('MetaMask not installed')),
    enable: () => Promise.reject(new Error('MetaMask not installed')),
    send:   () => Promise.reject(new Error('MetaMask not installed')),
    sendAsync: (_p, cb) => cb && cb(new Error('MetaMask not installed')),
    on() {}, removeListener() {}, removeAllListeners() {},
  };

  // Optional web3 stub (for very old libs)
  window.web3 = window.web3 || { currentProvider: null };

  // Quiet down the console: filter out wallet-noise
  const noisy = /MetaMask|ChromeTransport|connectChrome|extension not found|inpage\\.js/;
  const origErr  = console.error.bind(console);
  const origWarn = console.warn.bind(console);
  console.error = (...a) => (noisy.test(String(a[0])) ? undefined : origErr(...a));
  console.warn  = (...a) => (noisy.test(String(a[0])) ? undefined : origWarn(...a));
})();`,
        }}
      />
    </>
  )
}
