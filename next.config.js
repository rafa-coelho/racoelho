/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    serverActions: true,
  },
  // Staging nunca é indexado
  async headers() {
    if (process.env.NEXT_PUBLIC_SITE_ENV !== 'staging') return [];
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
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