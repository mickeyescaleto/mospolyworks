import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '6c303246-09c0-4a03-acf7-e714803867a6.selstorage.ru',
      },
      {
        protocol: 'https',
        hostname: '5b34e788-79f4-4a49-86b3-eee20853bc80.selstorage.ru',
      },
    ],
  },
};

export default nextConfig;
