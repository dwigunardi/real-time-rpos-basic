import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  devIndicators: false,
  images: {
    domains: ['https://bwhgxdafnosqezstmqfi.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bwhgxdafnosqezstmqfi.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
