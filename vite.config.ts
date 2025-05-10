import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    UnoCSS()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5300,
  },
  css: {
    postcss: {
      plugins: [],
    },
    modules: {
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
})
