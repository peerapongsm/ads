import { defineConfig } from "vite";

export default defineConfig({
  base: "/", // custom domain ads.peerapongsm.dev — no basePath
  test: { environment: "jsdom" },
});
