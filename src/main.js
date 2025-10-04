import './assets/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'

import bootstrap from '@/components/bootstrap/index'
import appConponents from '@/components/app/index'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(bootstrap)
app.use(appConponents)

app.mount('#app')


// const socket = new WebSocket(import.meta.env.VITE_WSS_URL)

// socket.addEventListener('open', ev => {
// })

// socket.onerror = () => {
//   const url = import.meta.env.VITE_WSS_URL
//   location.href = url.replace('wss', 'https')
// }
