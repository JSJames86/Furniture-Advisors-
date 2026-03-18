/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.ashleyfurniture.com' },
      { protocol: 'https', hostname: 'cdn.ashleyfurniture.com' },
    ],
  },
};

export default nextConfig;
