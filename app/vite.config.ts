import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Project-pages subpath in production (https://<user>.github.io/veelux-apparel/),
// root in dev. BASE_URL flows to asset() + the router basename.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/veelux-apparel/' : '/',
  plugins: [react(), tailwindcss()],
}))
