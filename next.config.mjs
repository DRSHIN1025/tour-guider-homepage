/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  // 아래 3개가 있으면 모두 제거/주석:
  // output: 'export',
  // assetPrefix: '...',
  // basePath: '...',
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
};

export default nextConfig;