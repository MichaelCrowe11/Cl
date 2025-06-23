/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  // Prepare for AI model integration
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 