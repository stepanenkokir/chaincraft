import './assets/main.css'

import { createApp } from 'vue'
//import AppFox from './AppFox.vue'
import App from './App.vue'
import router from './router'
import { VueTelegramPlugin } from 'vue-tg'
import i18n from './i18n'
import FontAwesomeIcon from './plugins/fontawesome' 
import Vue3TouchEvents, {
    type Vue3TouchEventsOptions,
  } from "vue3-touch-events"
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(i18n)
app.use(pinia);
app.use(VueTelegramPlugin)
app.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {
    disableClick: false    
})

app.mount('#app')
