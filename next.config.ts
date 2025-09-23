import type { NextConfig } from 'next';

const isExport = process.env.NEXT_EXPORT === 'true';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['knex'],
  output: isExport ? 'export' : undefined,
};

export default nextConfig;
