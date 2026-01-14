import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@core": "/src/core",
      "@plugins": "/src/plugins",
      "@shared": "/src/shared",
    },
  },
});
