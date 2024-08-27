import { createI18n } from 'vue-i18n'

interface Messages {
  [key: string]: { [key: string]: string }
}

const messages: Messages = {
  en: {
    welcomeGame     : 'Welcome to ChainCraft!',
    welcomeMessage  : 'Hi',
    unknownName     : 'Stranger',
    yourBallance    : 'Your balance',
    getReadyMsg_1   : 'Get ready to dive into the world of ChainCraft. Craft your own blockchains by playing fun mini-games. Win games and earn coins! The more you win, the more coins you get.',
    getReadyMsg_2   : 'Invite your friends, play together, and watch their progress in real-time. Spend your coins on in-game boosters, useful items in Telegram, place bets, or simply trade them with friends. In the future, you might even be able to cash out these coins for real money.',
    getReadyMsg_3   : "For detailed rules of each game and other possibilities, click the link below. Want to receive personal messages from me with reminders and achievement updates? Let me know, and I'll keep you posted!",
    getReadyMsg_4   : "to read the detailed rules.",
    clickHere       : "Click here"
  },
  ru: {
    welcomeGame     : 'Добро пожаловать в ChainCraft!',
    welcomeMessage  : 'Привет',
    unknownName     : 'Незнакомец',
    yourBallance    : 'Ваш баланс',
    getReadyMsg_1   : 'Я — ваш бот-помощник, и я здесь, чтобы помочь вам освоиться в мире блокчейнов, созданных в игре. Здесь вы сможете крафтить собственные блокчейны, играя в увлекательные мини-игры.',
    getReadyMsg_2   : 'Побеждайте и зарабатывайте монеты! Чем больше вы выигрываете, тем больше монет вы получите. Приглашайте друзей, играйте вместе и наблюдайте за их успехами в реальном времени. Монеты можно тратить на различные внутриигровые бонусы, полезные предметы в Телеграме, делать ставки в играх или даже обмениваться ими с друзьями. В будущем будет возможность обменять их на реальные деньги.',
    getReadyMsg_3   : "Чтобы узнать подробные правила каждой игры и узнать о других возможностях, переходите по ссылкам в нашем Телеграм-боте. Хотите получать от меня личные сообщения с напоминаниями и достижениями? Дайте знать, и я буду держать вас в курсе!",
    getReadyMsg_4   : "чтобы прочитать подробности",
    clickHere       : "Кликни сюда"
  },
}

const i18n = createI18n({
  legacy: false,
  locale: 'en', 
  messages,
})

export default i18n
