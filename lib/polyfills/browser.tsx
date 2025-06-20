"use client"

/**
 *  Silences “[ChromeTransport] connectChrome error: MetaMask extension not found”
 *  by providing the minimal shape the wallet helper looks for.
 */
declare global {
  interface Window {
    chrome?: Record<string, unknown>
    ethereum?: Record<string, unknown>
  }
}

if (typeof window !== "undefined") {
  // Many wallet helpers just check for existence; an empty object is enough.
  if (!window.chrome) window.chrome = {}
  if (!window.ethereum) window.ethereum = {}
}
