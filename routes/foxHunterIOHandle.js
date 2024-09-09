import crypto from 'crypto'
import { Redis } from 'ioredis'

import { saveFoxGameResult, saveUserToken, getUserBooster } from '../services/databaseHandler.js'

const redis = new Redis()

// Функция для генерации уникального ID игры
const generateUniqueId = () => {
    return crypto.randomUUID()
};

// Функция для генерации начального состояния поля
const generateInitialField = () => {
    const foxArray = []
    while (foxArray.length < 5) {
        const rndFox = Math.floor(Math.random() * 100)
        if (!foxArray.includes(rndFox)) {
            foxArray.push(rndFox)
        }
    }
    return foxArray
}

// Функция для старта новой игры
export const startNewFoxGame = async (socket) => {
    
    const gameId = generateUniqueId() // Генерируем уникальный ID игры
    const foxArray = generateInitialField() // Генерируем начальное расположение лис

    console.log("gameId",gameId,"foxArray",foxArray)

    // Создаем начальное состояние игры
    const gameState = {
        foxArray,                   // Массив с позициями лис
        moves: [],                  // История ходов
        spectators: [],             // Список наблюдателей
        startTime:null,
        finishTime:null,
        gameState: 'active',        // Текущее состояние игры (например, active, finished)
    }
    // Присоединяем игрока к комнате
    await saveUserToken(socket, 0, gameState, gameId)
    socket.join(gameId)
    socket.emit('gameCreated', { gameId })
}

// Функция для обработки хода игрока
export const handlePlayerMove = async (socket, { gameId, index, leftButton }) => {
    const fieldKey = `foxHunterGame:${gameId}:field`;
    const gameStateKey = `foxHunterGame:${gameId}:state`;

    // Загружаем текущее состояние игры
    const gameState = JSON.parse(await redis.get(gameStateKey));   
    //console.log(gameState)
    // Проверяем, находится ли игра в активном состоянии
    if (gameState.gameState !== 'active') {
        socket.emit('error', { message: 'Game is not active.' });
        return;
    }
    const currTime = new Date()
    if (gameState.moves.length===0){
        gameState.startTime = currTime
    }
    const startTime = new Date (gameState.startTime)
    const dT = currTime.getTime() - startTime.getTime()
    // Определяем новое состояние клетки
    let newStatus
    if (leftButton) {
        const foxNearby = gameState.foxArray.includes(index)
        const revealedValue = calculateFoxProximity(index, gameState.foxArray)
        
        newStatus = `${index}_${dT}_${leftButton}_${revealedValue}_${foxNearby}`

        // Добавляем ход в историю
        gameState.moves.push(newStatus)
       // console.log(gameState)

        //Проверяем лис
        if (foxNearby) {           
            if (gameState.moves.filter(it=>it.endsWith('_true')).length === 5) {               
                gameState.gameState = 'finished' // Завершаем игру, если найдены все лисы
            }
        }
    } else {
        // Обработка нажатия правой кнопки (пометка клетки)
        const currentStatus = await redis.hget(fieldKey, index)
       // console.log("CURRR ", currentStatus)
        const statusInfo = currentStatus.split('_')        

        newStatus=`${index}_${dT}_${leftButton}`

        if (statusInfo.length>4){
            const newStat = statusInfo[2]==="true" ? "false" : "true"
            newStatus = `${index}_${dT}_${newStat}_${statusInfo[3]}_${statusInfo[4]}`
        }else {
            if (statusInfo.length===3){
                newStatus=`${index}_${dT}_null`
            }
        }
       
        
        // newStatus = `${index}_${leftButton}_${revealedValue}_${dT}_${foxNearby}`
        gameState.moves.push(newStatus)
    }

    // Обновляем состояние клетки в Redis
    await redis.hset(fieldKey, index, newStatus)

    // Обновляем состояние игры в Redis
    await redis.set(gameStateKey, JSON.stringify(gameState))

    // Если игра закончена, уведомляем игроков
    if (gameState.gameState === 'finished') {
        gameState.finishTime = currTime
        const resultInfo = await calculateScore(socket, gameState)

        await saveFoxGameResult(socket, gameState, resultInfo)
         // Отправляем обновление клиенту
        socket.emit('moveMade', { index, status: newStatus, state: gameState.gameState, resultInfo })
        // Оповещаем всех участников комнаты о новом ходе
        socket.to(gameId).emit('updateField', { index, status: newStatus, state: gameState.gameState , resultInfo})
        
       // console.log("FIN!!!")
        // todo store result to MySQL
    } else {
        // Отправляем обновление клиенту
        socket.emit('moveMade', { index, status: newStatus, state: gameState.gameState })
        // Оповещаем всех участников комнаты о новом ходе
        socket.to(gameId).emit('updateField', { index, status: newStatus, state: gameState.gameState})
    }      

}

const calculateScore = async ( socket, gameState ) => {
    const moves = gameState.moves
    const nevMovesArr = moves.map(it=>{ 
        const splitData = it.split('_')
        return splitData[0]+"_"+splitData[2]+"_"+splitData[4]
    })
    const countMoves = [...new Set(nevMovesArr)].filter(it=>it.includes('_true_')).length
    
    const startTime = new Date (gameState.startTime)
    const finishTime = new Date (gameState.finishTime)
    const totalTime = finishTime.getTime() - startTime.getTime()

    const userBooster = await getUserBooster(socket)

    // time bonus is time in ms from 5 minutes of game
    const timeFrom3Min = Math.floor((300000 - totalTime) / 1000)
    const timeBonus = timeFrom3Min>0 ? timeFrom3Min : 0

    // step bonus is steps from 50 steps
    const stepCount = 50 - countMoves
    const stepBonus = stepCount>0 ? stepCount*300 : 0
    
    const score = stepBonus>0 && timeBonus>0 ? userBooster * (stepBonus + timeBonus) : 1

    return {
        time    : totalTime,
        count   : countMoves,
        score   : score
    }
}

// Функция для расчета количества лис вокруг клетки
const calculateFoxProximity = (index, foxArray) => {
    const directions = [-1, 1, 9, 10, 11, -9, -10, -11]
    let count = 0
    directions.forEach((dir) => {
        let pos = index + dir
        while (pos >= 0 && pos < 100 
            && Math.floor(pos / 10) === Math.floor((pos - dir) / 10) + Math.sign(dir) * (Math.abs(dir) >= 9 ? 1 : 0)) {
            if (foxArray.includes(pos)) {
                count++
                break
            }
            pos += dir
        }
    })
    return count
}
