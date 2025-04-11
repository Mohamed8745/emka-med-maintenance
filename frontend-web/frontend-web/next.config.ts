import type { NextConfig } from "next";

import nextI18NextConfig from './next-i18next.config';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // No 'appDir' here
  experimental: {
    // Only include valid experimental features, such as React 18 or other flags.
  },
  // i18n config is handled in the next-i18next.config.js, no need to repeat it here.
};

export default nextConfig;
