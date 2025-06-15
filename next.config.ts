import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['formerr.tech', 'localhost:3000'],
    },
  },
  async headers() {
    return [
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' ? '*' : 'https://formerr.tech',
          },
        ],
      },
    ];
  },
};

export default nextConfig;