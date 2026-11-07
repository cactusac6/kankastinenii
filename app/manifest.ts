import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kaňka stínění — žaluzie, rolety a sítě",
    short_name: "Kaňka stínění",
    description: "Prodej, montáž a opravy žaluzií, rolet, markýz a sítí proti hmyzu v Mladé Boleslavi a okolí.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#d97706",
    lang: "cs",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
