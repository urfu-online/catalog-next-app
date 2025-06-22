/** @type {import("next").NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3']
  },
  hostname: '0.0.0.0',
  port: 3000
}
module.exports = nextConfig
