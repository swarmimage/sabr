import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: { root: process.cwd() },
  async redirects() {
    return [{ source: "/", destination: "/ru", permanent: false }];
  },
  async headers() {
    return [
      {
        // Сервис-воркер не должен залипать в кэше CDN/браузера, иначе обновления не доедут.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
