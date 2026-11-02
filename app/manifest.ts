import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RegExpresso — regex tester & explainer",
    short_name: "RegExpresso",
    description:
      "Test, explain and learn regular expressions in 15 languages. Everything runs in your browser.",
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
