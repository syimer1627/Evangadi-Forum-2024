import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure the build output goes to the 'dist' folder
    sourcemap: true // Optional: Generate source maps for debugging in production (optional for production)
  }
})

