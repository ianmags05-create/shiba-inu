/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "khaki-meerkat-385691.hostingersite.com",
        "shibainupetshop.com",
        "www.shibainupetshop.com",
      ],
    },
  },
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
