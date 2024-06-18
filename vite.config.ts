import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'build', // Change this to 'build' if you want to use /app/build
    },
  server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:9990',
          changeOrigin: false,
        }
      }
  }
})
