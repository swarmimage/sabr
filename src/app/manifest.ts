import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Сабр",
    short_name: "Сабр",
    description: "Терпение, взгляд, чистота",
    start_url: "/ru",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a3a2d",
    theme_color: "#0a3a2d",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
