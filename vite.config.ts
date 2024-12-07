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
        rewrite: (path) => {
          const newPath = path.replace(/^\/llm/, "");
          return newPath;
        },
      },
    },
  },
});
