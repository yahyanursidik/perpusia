import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import { defineConfig, envField } from "astro/config";

export default defineConfig({
  adapter: vercel(),
  output: "server",
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      SITE_URL: envField.string({
        context: "server",
        access: "public",
        optional: true,
        url: true,
      }),
      S3_ENDPOINT: envField.string({
        context: "server",
        access: "secret",
        optional: true,
        url: true,
      }),
      S3_REGION: envField.string({ context: "server", access: "secret", optional: true }),
      S3_ACCESS_KEY_ID: envField.string({ context: "server", access: "secret", optional: true }),
      S3_SECRET_ACCESS_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      S3_BUCKET: envField.string({ context: "server", access: "secret", optional: true }),
      S3_PUBLIC_BASE_URL: envField.string({
        context: "server",
        access: "public",
        optional: true,
        url: true,
      }),
    },
  },
});
