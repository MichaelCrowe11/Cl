/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Optimize for production deployment
  poweredByHeader: false,
  
  // Environment configuration
  env: {
    CUSTOM_KEY: process.env.NODE_ENV,
  },

  // Experimental features for performance
  experimental: {
    // Enable server components
    serverComponentsExternalPackages: ['@prisma/client'],
    // Optimize bundle
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Image optimization for GCP
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      }
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  },

  // Webpack configuration for optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Production optimizations
    if (!dev) {
      // Minimize bundle size
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
      };
    }

    return config;
  },

  // Compression
  compress: true,

  // Performance optimizations
  swcMinify: true,

  // Static file handling
  trailingSlash: false,

  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // TypeScript configuration
  typescript: {
    // Only fail build on type errors in production
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Only fail build on ESLint errors in production
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
