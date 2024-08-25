import { findUser, checkToken, createNewFoxGame } from "../services/databaseHandler.js"
import crypto from 'crypto'

// Вспомогательная функция для проверки данных Telegram
const verifyTelegramData = (initData, botToken)=> {
    const secret = crypto.createHash('sha256').update(botToken).digest();
    const dataCheckString = Object.keys(initData)
        .filter(key => key !== 'hash')
        .map(key => `${key}=${initData[key]}`)
        .sort()
        .join('\n')

    const hmac = crypto.createHmac('sha256', secret)
        .update(dataCheckString)
        .digest('hex')

    return hmac === initData.hash
}

export const setUser =  async (req, res) => {
    const { initData, token } = req.body;
    if (!verifyTelegramData(initData, config.botToken)) {
        return res.status(401).json({ error: 'Invalid data' })
    }

    let user = await findUser( initData )
    
    res.json({ success: true })
}

// Старт игры через HTTP (можно также инициировать через Socket.io)
export const startFoxGame = async (req, res) => {
    const { token } = req.body;
    const user = await checkToken( token ) 

    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const foxArr = Array.from(new Set(Array.from({ length: 5 }, () => Math.floor(Math.random() * 100))))

    const game = await createNewFoxGame( foxArr, user.id ) 

    res.json({ gameId: game.id })
}
