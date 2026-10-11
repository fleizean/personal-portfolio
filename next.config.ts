import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Docker imajı için: yalnızca çalışma zamanında gereken dosyaları .next/standalone'a toplar
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-images-1.medium.com',
      },
    ],
  },
};

export default nextConfig;
