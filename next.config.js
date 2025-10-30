/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.racoelho.com.br' }],
        destination: 'https://racoelho.com.br/:path*',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig; 