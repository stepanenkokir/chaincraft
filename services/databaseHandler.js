import db from '../models/index.js'

export const findAllUsers = async ( initData ) =>{
    const TIMEOUT_MS = 1000; // 1 second

    // Create a promise that rejects after the timeout
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), TIMEOUT_MS)
    );

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
            telegram_id     : userInfo.id,
            language_code   : userInfo.language_code,
            last_name       : userInfo.last_name,
            first_name      : userInfo.first_name,
            username        : userInfo.username,
            token           : userInfo.token,
            balance         : 0,
        }

        console.log("currentUserInfo",currentUserInfo)

        const [user, created] = await db.Users.findOrCreate({ 
            where: { 
                telegram_id: userInfo.id 
            },
            defaults : currentUserInfo
        })                
    
        if (created) {
            console.log("Create new user ",user.id, user.username, user.first_name, user.last_name )
        }
        return user
    } catch (error) {
        console.log("Error findUser: ",error.message)
        return null
    }
}

export const checkToken = async ( token ) =>{
    return await db.User.findOne({ where: { token } })
}

export const createNewFoxGame = async ( foxArr, user_id ) =>{
    return await db.GameInitialization.create({
        user_id: user_id,
        foxArr,
        start_time: new Date(),
    })
}