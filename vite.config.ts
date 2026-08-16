import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import mkcert from 'vite-plugin-mkcert'
import Components from 'unplugin-vue-components/vite'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mkcert(),
    Components({
      resolvers: [
        BootstrapVueNextResolver(),  // Resuelve componentes de BootstrapVueNext
        IconsResolver({              // Resuelve íconos automáticamente
          prefix: 'i',               // Prefijo para los íconos (opcional)
          enabledCollections: ['bi', 'mdi', 'carbon', 'ri'] // Sets que quieres usar
        })
      ],
      dirs: ['src/components/commons'], // Escanea solo esta carpeta
      extensions: ['vue'],
    }),
    Icons({
      compiler: 'vue3',             // Usar Vue 3
      autoInstall: false,           // No instalar automáticamente (mejor control)
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    noDiscovery: true,
    include: undefined
  },
})
