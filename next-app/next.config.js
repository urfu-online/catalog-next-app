/** @type {import("next").NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3']
  }
}
module.exports = nextConfig
