import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/staff/", "/staff-portal/"],
    },
    sitemap: "https://shibainupetshop.com/sitemap.xml",
    host: "https://shibainupetshop.com",
  };
}
