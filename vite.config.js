import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), mkcert()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: { https: true }, // Not needed for Vite 5+
  // build: {
  //   // https://router.vuejs.org/guide/advanced/lazy-loading.html
  //   rollupOptions: {
  //     // https://rollupjs.org/guide/en/#outputmanualchuncks
  //     output: {
  //       manualChunks: {
  //         'group-report': [
  //           './src/views/report/person/ReportPerson',
  //           './src/views/report/ReportLayout',
  //           './src/views/report/ReportIndex',
  //         ]
  //       }
  //     }
  //   }
  // }
})
