/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server-side rendering
  images: {
    domains: ['sv.epaenlinea.com', 'firebasestorage.googleapis.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sv.epaenlinea.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '**',
      },
      // Add any other domains you might use for images
    ],
  },
  // Match Firebase hosting configuration
  trailingSlash: false,
};

export default nextConfig;
