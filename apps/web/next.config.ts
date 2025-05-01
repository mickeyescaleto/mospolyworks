import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '5b34e788-79f4-4a49-86b3-eee20853bc80.selstorage.ru',
      },
    ],
  },
};

export default nextConfig;
