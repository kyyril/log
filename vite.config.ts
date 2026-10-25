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
  envPrefix: ['VITE_', 'MAL_'],
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
      '/api/igdb-list': {
        target: 'https://r.jina.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/igdb-list\/([^/]+)\/([^/]+)/, '/https://www.igdb.com/users/$1/lists/$2'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => proxyReq.setHeader('X-Return-Format', 'html'))
        },
      },
    }
  },
})
