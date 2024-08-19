import { createI18n } from 'vue-i18n'

interface Messages {
  [key: string]: { [key: string]: string }
}

const messages: Messages = {
  en: {
    welcomeMessage: 'Welcome',
    welcomeBackMessage: 'Welcome back',
    
  },
  ru: {
    welcomeMessage: 'Добро пожаловать',
    welcomeBackMessage: 'С возвращением',
    
  },
}

const i18n = createI18n({
  legacy: false,
  locale: 'en', 
  messages,
})

export default i18n
