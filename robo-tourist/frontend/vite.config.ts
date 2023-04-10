import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 2000, // you can replace this port with any port
    proxy: {
      // Proxy options here
      "/api": {
        target: "http://roboguide.xyz:2500/",
        // target: "http://localhost:2500",
        changeOrigin: true,
      },
    },
  },
});
