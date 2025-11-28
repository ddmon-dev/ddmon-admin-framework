import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['ckeditor5'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
