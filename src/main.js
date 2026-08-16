import '@/assets/css/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'
import { PiniaColadaAutoRefetch } from '@pinia/colada-plugin-auto-refetch'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { plugin as VueTippy } from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css' // Tema claro (opcional)
import App from './App.vue'
import { router } from './router'
import { events, initAxiosInterceptors } from '@/api/client'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(PiniaColada, {
    // Configuración global (opcional)
    plugins: [
        PiniaColadaAutoRefetch({
            // global default (can be overridden per-query)
            // autoRefetch: true,
        }),
    ],
})
app.use(router)
app.use(VueTippy, {
    directive: 'tippy',         // Nombre de la directiva (por defecto: 'tippy')
    component: 'tippy',         // Nombre del componente (por defecto: 'tippy')
    componentSingleton: 'tippy-singleton', // Para tooltips singleton (avanzado)
    defaultProps: {             // Props por defecto para todos los tooltips
        placement: 'bottom',        // Posición por defecto
        allowHTML: false,           // Por seguridad, no permitir HTML por defecto
        animation: 'fade',          // Animación por defecto
        duration: 100,              // Duración de la animación
        delay: [1000, 100],
        trigger: 'mouseenter'
    },
})

events.on('unauthorized', () => {
    router.push({
        name: 'auth-login',
        query: { next: router.currentRoute.value.fullPath }
    }).catch(() => {
        // Ignorar redirecciones duplicadas o bloqueos menores.
    })
})

// Inicializar interceptor con dependencias ya creadas
initAxiosInterceptors()

app.mount('#app')