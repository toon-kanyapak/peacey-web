import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
  // so the build needs to know that prefix or every asset 404s. The deploy
  // workflow sets VITE_BASE from the repo name; local dev stays at "/".
  // For a user/org page (<user>.github.io) or a custom domain, leave it unset.
  base: process.env.VITE_BASE ?? '/',
})
