import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [svelte()],
  server: {
    port: 9111,
    host: true
  },
  build: {
    outDir: 'docs'
  }
})
