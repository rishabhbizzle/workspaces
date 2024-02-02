/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'unnqhekpyfothamnuiqg.supabase.co',
          },
        ],
      },
};

export default nextConfig;
