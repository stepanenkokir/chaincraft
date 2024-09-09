import { Redis } from 'ioredis'
import db from '../models/index.js'

const redis = new Redis()

export const findAllUsers = async ( initData ) =>{
    const TIMEOUT_MS = 1000; // 1 second

    // Create a promise that rejects after the timeout
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), TIMEOUT_MS)
    )

    try {
        const users = await Promise.race([
            db.User.findAll(),
            timeoutPromise
        ]);

        return users;
    } catch (error) {
        console.log("Error findAllUsers: ",error.message)
        return null
    }
}

export const findOrCreateUser = async ( userInfo ) =>{
    try {
        const currentUserInfo = {
            telegram_id         : userInfo.id,
            language_code       : userInfo.language_code,
            last_name           : userInfo.last_name,
            first_name          : userInfo.first_name,
            username            : userInfo.username,
            current_game_id     : null,
            current_game_type   : null,
            total_balance       : 0,
        }

        let resultInfo = [
            { id: 1, result: 'Best result: 0' }, // Stock101 result
            { id: 2, result: 'Best result: 0' }, // FoxHunter result
            { id: 3, result: 'Best result: 0' }, // Tic Tac Toe result
        ]

        const [user, created] = await db.users.findOrCreate({ 
            where: { 
                telegram_id: userInfo.id 
            },
            defaults : currentUserInfo
        })                
    
        if (created) {
            console.log("Create new user ",user.user_id, user.username, user.first_name, user.last_name )

        } else {
            if (userInfo.language_code !== user.language_code ){
                console.log("Change language from ", user.language_code, " to" , userInfo.language_code)
                await user.update({
                    language_code:userInfo.language_code
                })
            }

            const foxInfo = await db.fox_game_result.findOne({
                where:{
                    user_id: user.user_id
                }
            })

            if (foxInfo){
                resultInfo = []
                resultInfo.push({id:2, result: `Best result: ${foxInfo.get('best_score')}`})
            }
        } 

        return { data: user, resultInfo: resultInfo, first_time: created }
    } catch (error) {
        console.log("Error findUser: ",error.message)
        return null
    }
}

export const saveUserToken = async (socket, typeOfGame, gameState, gameId) => {
    console.log("SAVE GAME TOKEN", socket.userInfo)
    console.log("GAME ID", gameId)
    console.log("GAME STATE", gameState)
    try {
        const user = await db.users.findOne({
            where: { 
                telegram_id   : socket.userInfo.id 
            }
        })
        
        const oldGameId = user.current_game_id

        if (oldGameId) {
            const oldFieldKey = `foxHunterGame:${oldGameId}:field`
            const oldStateKey = `foxHunterGame:${oldGameId}:state`
        
            await redis.del(oldFieldKey)
            await redis.del(oldStateKey)
        }

        // Инициализируем поле в Redis (все клетки изначально "unchecked")
        const fieldKey = `foxHunterGame:${gameId}:field`
        for (let i = 0; i < 100; i++) {
            await redis.hset(fieldKey, i, 'unchecked')
        }

        // Сохраняем начальное состояние игры в Redis
        await redis.set(`foxHunterGame:${gameId}:state`, JSON.stringify(gameState))
        // Время жизни игры в базе - 1 час
        await redis.expire(`foxHunterGame:${gameId}:state`, 3600)
        await redis.expire(`foxHunterGame:${gameId}:field`, 3600)

        await user.update(
            {
                current_game_id         : gameId,
                current_game_type       : typeOfGame,
            }
        )
    } catch (error) {
        console.log("Can't save user stat: ", error.message)
    }
}

//------------------FoxHunter
export const saveFoxGameResult = async (socket, gameState, resultInfo) => {
    try {
        const user = await db.users.findOne({
            where: { 
                telegram_id   : socket.userInfo.id 
            }
        })
        
        // save foxGame
        const foxGameInfo = {
            user_id: user.user_id,
            fox_arr: JSON.stringify(gameState.foxArray),
            moves: JSON.stringify(gameState.moves),
            game_time: resultInfo.time,         
            count_result: resultInfo.count,
            score: resultInfo.score,
        }
        console.log("foxGameInfo",foxGameInfo)

        const foxGame = await db.fox_game.create({
            user_id: user.user_id,
            fox_arr: JSON.stringify(gameState.foxArray),
            moves: db.sequelize.literal(`COMPRESS('${JSON.stringify(gameState.moves)}')`),
            game_time: resultInfo.time,         
            count_result: resultInfo.count,
            score: resultInfo.score,
        })

        const foxGameResultInfo = {                                
            count               : 1,
            best_click          : resultInfo.count,
            best_time           : resultInfo.time,            
            best_score          : resultInfo.score
        }

        const [foxGameResult, created] = await db.fox_game_result.findOrCreate({
            where:{
                user_id : user.user_id,
            },
            defaults : foxGameResultInfo
        })

        if (!created){
            await foxGameResult.update({                                
                count                   : foxGameResult.count+1,
                best_click              : 
                    resultInfo.count < foxGameResult.best_click ?
                    resultInfo.count    : foxGameResult.best_click,
                best_time               : 
                    resultInfo.count < foxGameResult.best_click ?
                    resultInfo.time     : foxGameResult.best_time,                
                best_score              : 
                    resultInfo.score > foxGameResult.best_score ?
                    resultInfo.score    : foxGameResult.best_score
            })            
        }

        await updateTotalScore( socket )
    
    } catch (error) {
        console.log("Error saveFoxGameResult: ", error)
    } 
}

const updateTotalScore = async ( socket ) => {
    try {
        const user = await db.users.findOne({
            where: { 
                telegram_id   : socket.userInfo.id 
            }
        })

        const { fn, col } = db.sequelize;

        const totalBalance = await db.fox_game.findOne({
            attributes: [[fn('SUM', col('score')), 'totalScore']], // Use Sequelize.fn for SUM
            where: {
                user_id: user.user_id
            }
        })

        user.total_balance = totalBalance ? totalBalance.get('totalScore') : 0

        console.log("Save new total_score",user)
        await user.save()

        socket.emit('new-user-balance', {
            balance     : user.total_score,           
        })

    } catch (error) {
        console.log("Error updateTotalScore: ", error)
    } 
}

export const getUserBooster = async ( socket ) => {
    try {
        
        return 1

    } catch (error) {
        console.log("Error getUserBooster: ", error)
        return 1
    }
}
