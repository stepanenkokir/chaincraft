import { checkToken, createNewFoxGame, findOrCreateUser } from "../services/databaseHandler.js"
import config from 'config'
import crypto from 'crypto'
import { Redis } from "ioredis"

const redis = new Redis()

const generateUniqueId = () => {
    return crypto.randomUUID() // Generates a UUID (Universally Unique Identifier)
}

const generateInitialField = () => {
    const foxArray = []
    
    let foxCount = 5

    while (foxCount>0){
        const rndFox =  Math.floor(Math.random() * 100)
        if (!foxArray.includes(rndFox)){
            foxArray.push(rndFox)
            foxCount--
        }
    }
    return foxArray
}

export const processMove = ( game, id, index, check ) =>{

    return {visibleFoxes: 2, result:null}
}

export const  handleSelectField = ( socket, io, data ) =>{
    console.log("handleSelectField ", data)
    redis.get(`game:${data.gameId}`, (err, result) => {
        if (err) {
            return console.error('Error fetching game:', err)
        }
    
        const game = JSON.parse(result)
        if ( !game || game.gameState !== 'active' ) {
            return
        }
    
        const moveResult = processMove( game, socket.id, data.index, data.check )
        game.moves.push({
            playerId: socket.id, 
            index: data.index, 
            check: data.check, 
            moveResult 
        })
    
        console.log("Move ", game)
        redis.set(`game:${data.gameId}`, JSON.stringify(game))
        io.to(data.gameId).emit('moveProcessed', { index, check, moveResult })
    })
}

export const handleJoinGame = ( socket, gameId ) =>{
    redis.get(`game:${gameId}`, (err, result) => {
        if (err) {
            return console.error('Error fetching game:', err)
        }
    
        const game = JSON.parse(result)
        if (game) {
            game.spectators.push(socket.id)
            redis.set(`game:${gameId}`, JSON.stringify(game))
            socket.join(gameId)
            socket.emit('gameState', game)
        }
      })
}

export const handleEndGame = ( gameId ) => {
    redis.del(`game:${gameId}`, (err) => {
        if (err) {
             console.error('Error deleting game from Redis:', err)
        }
        else {
            console.log('Game ended and deleted from Redis')
        }
    })
}

export const startNewFoxGame = async ( socket ) =>{    
    const gameId = generateUniqueId(); // Генерируем уникальный ID игры
    const game = {
        players: {
            [socket.id]: {
              field: generateInitialField(), // Начальное состояние поля для игрока
              movesCount: 0,                 // Количество сделанных ходов
              score: 0,                      // Текущий счет игрока
              isActive: true,                // Статус активности игрока
            },
          },
          moves: [],                          // История ходов игры
          spectators: [],                     // Наблюдатели
          gameState: 'active',                // Текущее состояние игры
    }
    
    console.log("NEW GAME:",gameId, JSON.stringify(game))

    redis.set(`game:${gameId}`, JSON.stringify(game))
    socket.join(gameId); // Подключаем игрока к комнате
    socket.emit('gameCreated', { gameId })
}

export const checkUser = async (socket, data ) => {
    const validUser = verifyTelegramData(data.initData)

    if (!validUser){
        console.log('No validate')
        return socket.emit('invalidToken', { status:false, message:"Invalid token"})
    }
    
    const findUser = await findOrCreateUser( validUser )
    if (findUser){
        socket.emit('checkUserResponse', {
            status      : true,
            user_id     : findUser.data.user_id,
            lang        : findUser.data.language_code,
            user_name   : `${findUser?.data.first_name ? findUser.data.first_name : findUser.data.username }`, 
            balance     : findUser.data.balance,
            first_time  : findUser.first_time
        })
    } else {
        return socket.emit('unknownUser', { status:false, message:`Invalid user ${JSON.stringify(validUser)}`})
    }
}

const verifyTelegramData = (initData) => {
    try {
        const botToken = config.get('botToken')
        
        const params = new URLSearchParams(initData)
        const hash = params.get('hash')
        params.delete('hash')
    
        // Сортировка ключей в алфавитном порядке и создание строки data-check-string
        const sortedParams = Array.from(params.entries()).sort((a, b) => a[0].localeCompare(b[0]))
        const dataCheckString = sortedParams.map(([key, value]) => `${key}=${value}`).join('\n')
        // Step 1: Generate the secret key
        const secretKey = crypto.createHmac('sha256', 'WebAppData')
            .update(botToken)
            .digest()

        // Step 3: Compute the HMAC hash
        const hmac = crypto.createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex')

        const currUser = JSON.parse(params.get('user'))
        currUser.token = hash

        // Step 4: Compare computed HMAC with the received hash
        return hmac === hash ? currUser : null

    } catch (error) {
        console.log("Error verifyTelegramData: ", error.message);
        return null
    }
}
