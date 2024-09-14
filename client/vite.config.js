import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/pixabay-image": {
        target: "https://pixabay.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pixabay-image/, ""),
      },
    },
  },
});
