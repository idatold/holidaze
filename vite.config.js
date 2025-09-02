import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',           // ← needed for DOM APIs
    globals: true,                   // allows describe/it/expect without importing
    setupFiles: './src/test/setup.js'
  }
})
