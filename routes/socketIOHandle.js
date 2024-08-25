import { checkToken, createNewFoxGame } from "../services/databaseHandler.js"
import config from 'config'
import crypto from 'crypto'


export const startIONewFoxGame = async ( data, socket ) =>{
    const { token } = data
    const user = await checkToken( token ) 

    if (!user) {
        socket.emit('error', { message: 'Unauthorized' });
        return
    }
    const foxArr = Array.from(new Set(Array.from({ length: 5 }, () => Math.floor(Math.random() * 100))))
    const game = await createNewFoxGame( foxArr, user.id ) 
    socket.emit('gameStarted', { gameId: game.id })
}

// Обработка события проверки результата через Socket.io
export const checkIOFoxResult  = async ( data, socket ) => {
    const { gameId } = data;
    const game = await GameInitialization.findByPk(gameId)

    if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
    }

    const result = yourFunction(game.foxArr); // Ваша функция обработки

    await game.update({ result, end_time: new Date() });

    socket.emit('result', { result });
}

export const observeIOFoxGame = async (data) => {
    const { gameId } = data;
    const game = await GameInitialization.findByPk(gameId);

    if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
    }

    socket.emit('gameData', { foxArr: game.foxArr, start_time: game.start_time });
}

export const checkUser = async (socket, data ) => {
    console.log(data.userInfo, data.initData )
    const valid = verifyTelegramData(data.initData)
    console.log('valid = ', valid)
    socket.emit('checkUserResponse', {
        user_id: 112,
        lang:'ru',
        user_name: `${data.userInfo?.first_name ? data.userInfo.first_name : 'Unknown' }`, 
        balance: 9876,
    })
}

// Вспомогательная функция для проверки данных Telegram
const verifyTelegramDataOld = (initData)=> {
    try{
        const botToken = config.get('botToken')
        const secret = crypto.createHash('sha256').update(botToken).digest()

        console.log("Secret", secret)
        const dataCheckString = Object.keys(initData)
            .filter(key => key !== 'hash')
            .map(key => `${key}=${initData[key]}`)
            .sort()
            .join('\n')
    
        
        console.log("dataCheckString", dataCheckString)
        
        const hmac = crypto.createHmac('sha256', secret)
            .update(dataCheckString)
            .digest('hex')
        
        console.log("hmac", hmac)
        
        return hmac === initData.hash
    }catch(error){
        console.log("Error verifyTelegramData: ", error.message)
        return false
    }
}

const verifyTelegramData = (initData) => {
    try {
        const botToken = config.get('botToken');
        
        console.log(0,initData)
        
        // Step 1: Generate the secret key
        const secretKey = crypto.createHmac('sha256', 'WebAppData')
            .update(botToken)
            .digest();
        
            console.log(1, secretKey)
        // Step 2: Create the dataCheckString
        const dataCheckString = Object.keys(initData)
            .filter(key => key !== 'hash') // Exclude the hash field
            .sort() // Sort keys alphabetically
            .map(key => `${key}=${initData[key]}`) // Create key=value pairs
            .join('\n'); // Join pairs with newline separator

        // Step 3: Compute the HMAC hash
        const hmac = crypto.createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

            console.log(2, hmac)
            console.log(3, initData.hash)
        // Step 4: Compare computed HMAC with the received hash
        return hmac === initData.hash;

    } catch (error) {
        console.log("Error verifyTelegramData: ", error.message);
        return false;
    }
};
