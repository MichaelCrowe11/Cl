/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  transpilePackages: [
    '@xterm/xterm',
    '@xterm/addon-fit', 
    'xterm',
    'xterm-addon-fit',
    'vaul',
    'react-day-picker'
  ],
  eslint: {
    // Allow production builds to complete even with ESLint errors/warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  generateEtags: false,
}

export default nextConfig
