import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, '.'),
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  },
};

export default nextConfig;
