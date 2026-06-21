import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  base: './',
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: '/src/lib',
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svelte'],
  },
  envPrefix: ['VITE_', 'MAL_', 'RAWG_'],
  server: {
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api/myanimelist': {
        target: 'https://api.myanimelist.net/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/myanimelist/, ''),
      },
      '/api/rawg': {
        target: 'https://api.rawg.io/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rawg/, ''),
      }
    }
  },
})
