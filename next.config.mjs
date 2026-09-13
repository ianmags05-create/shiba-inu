/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/shiba-homepage.html",
        },
      ],
    };
  },
};

export default nextConfig;
