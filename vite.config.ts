import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './',
  server: {
    proxy: {
      '/api/spiget': {
        target: 'https://api.spiget.org/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/spiget/, ''),
      },
      '/api/hangar': {
        target: 'https://hangar.papermc.io/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hangar/, ''),
      },
      '/api/modrinth': {
        target: 'https://api.modrinth.com/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/modrinth/, ''),
      },
    },
  },
})
