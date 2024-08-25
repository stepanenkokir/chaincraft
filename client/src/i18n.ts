import { createI18n } from 'vue-i18n'

interface Messages {
  [key: string]: { [key: string]: string }
}

const messages: Messages = {
  en: {
    welcomeMessage  : 'Hi',
    unknownName     : 'Stranger',
    yourBallance    : 'Your balance',
  },
  ru: {
    welcomeMessage  : 'Привет',
    unknownName     : 'Незнакомец',
    yourBallance    : 'Ваш баланс',
    
  },
}

const i18n = createI18n({
  legacy: false,
  locale: 'en', 
  messages,
})

export default i18n
