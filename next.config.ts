import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },
};

export default nextConfig;