/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lpuxklrgvftvhlnhyero.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
