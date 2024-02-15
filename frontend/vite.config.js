import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production",
    }),
  ],
  // proxy will force the frontend server to act like it's being served from the backend server
  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
  // To automatically open the app in the browser whenever the server starts,
  // uncomment the following lines:
  // server: {
  //   open: true
  // }
}));
