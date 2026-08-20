import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// The API base can be overridden with VITE_API_BASE. By default the dev server
// proxies /api to the FastAPI backend on :8000, so no CORS juggling is needed.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
