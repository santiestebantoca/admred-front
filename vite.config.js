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
        BootstrapVueNextResolver(), // Resuelve componentes de BootstrapVueNext
        IconsResolver()
      ],
      dts: true,
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // El backend web2py de desarrollo usa un certificado autofirmado que el
    // navegador rechaza. Con este proxy el navegador solo habla con el dev
    // server (mkcert) y es Vite quien se conecta a web2py ignorando su
    // certificado (`secure: false`). Requiere VITE_API_URL="/admred" en
    // .env.local; además deja las peticiones en el mismo origen (sin CORS).
    proxy: {
      '/admred': {
        target: 'https://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    noDiscovery: true,
    include: undefined
  },
});
