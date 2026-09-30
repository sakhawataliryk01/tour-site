/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone build for VPS / Docker (not Vercel)
  output: 'standalone',
  experimental: {
    // Hero images up to 5 MB via server actions
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
