import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// TO DO: Avoid setting global this way
export default defineConfig({
  plugins: [react()],
  define: { global: 'window' }
})
