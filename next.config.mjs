/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    NEXT_PUBLIC_APP_URL:process.env.NEXT_PUBLIC_APP_URL
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};

export default nextConfig;
