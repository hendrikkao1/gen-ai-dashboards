import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/llm": {
        target: "https://api.anthropic.com/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/llm/, ""),
        headers: {
          "anthropic-dangerous-direct-browser-access": "true",
        },
      },
    },
  },
});
