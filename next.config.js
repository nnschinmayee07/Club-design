/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  compress: true,
  // Reduce JS bundle sent to client
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
}

module.exports = nextConfig
