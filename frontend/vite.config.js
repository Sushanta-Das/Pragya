import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "https://de15-2409-40e0-f-6366-e486-3377-22f4-7c6f.ngrok-free.app",
    },
  },
});
