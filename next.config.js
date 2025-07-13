/** @type {import('next').NextConfig} */

// Bundle analyzer setup
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config

const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // SWC minification is enabled by default in Next.js 13+
  
  // Standalone output for optimized Docker deployments
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  
  // Image optimization
  images: {
    domains: [
      'localhost',
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').split('/')[0] || '',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ].filter(Boolean),
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  
  // Experimental features for better performance
  experimental: {
    // Enable optimized CSS
    optimizeCss: true,
    // Modern JS output
    esmExternals: true,
    // Better tree shaking
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@supabase/supabase-js',
      'react-dropzone',
    ],
  },
  
  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        // Cache static assets
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Webpack configuration for optimizations
  webpack: (config, { isServer, dev }) => {
    // Fix for 'self is not defined' error
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'monaco-editor': 'monaco-editor',
        '@monaco-editor/react': '@monaco-editor/react',
      })
    }
    
    // Reduce bundle size by replacing modules
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Replace large libraries with smaller alternatives in production
        ...(process.env.NODE_ENV === 'production' && {
          '@sentry/node': false,
          'encoding': false,
        }),
      }
    }
    
    // Enable webpack 5 optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common components chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Separate large libraries
            supabase: {
              name: 'supabase',
              test: /[\\/]node_modules[\\/](@supabase)[\\/]/,
              chunks: 'all',
              priority: 30,
            },
            monaco: {
              name: 'monaco',
              test: /[\\/]node_modules[\\/](monaco-editor|@monaco-editor)[\\/]/,
              chunks: 'all',
              priority: 30,
            },
          },
        },
      }
    }
    
    return config
  },
  
  // Environment variables to expose to the browser
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  
  // Redirects for old URLs
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/signin',
        destination: '/auth/login',
        permanent: true,
      },
    ]
  },
  
  // Ignore TypeScript errors in production build (use with caution)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Ignore ESLint errors in production build (use with caution)
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = withBundleAnalyzer(nextConfig)