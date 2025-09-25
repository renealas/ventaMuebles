/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sv.epaenlinea.com',
        pathname: '**',
      },
      // Add any other domains you might use for images
    ],
  },
  // Match Firebase hosting configuration
  trailingSlash: false,
};

export default nextConfig;
