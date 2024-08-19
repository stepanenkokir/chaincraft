import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueTelegramPlugin } from 'vue-tg'
import i18n from './i18n'
import FontAwesomeIcon from './plugins/fontawesome' 
import Vue3TouchEvents from 'vue3-touch-events'

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(i18n)
app.use(VueTelegramPlugin)


app.use(Vue3TouchEvents, {
    disableClick: false,  // Это предотвращает блокировку событий `click`
    touchClass: '',       // Здесь можно указать класс CSS, который будет применяться при касании
    tapTolerance: 10,     // Чувствительность события `tap` в пикселях
    swipeTolerance: 30,   // Чувствительность события `swipe` в пикселях
    longTapTimeInterval: 400 // Время для долгого нажатия в миллисекундах
  });

app.mount('#app')
