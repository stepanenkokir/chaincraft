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

export const findUser = async ( initData ) =>{
    try {
        console.log("initData",initData)

        const user = await db.User.findOne({ 
            where: { 
                telegram_id: initData.id 
            } 
        })
    
        // if (!user) {
        //     user = await db.User.create({
        //         telegram_id : initData.id,
        //         username    : initData.username,
        //         token
        //     })
        // }
    
        return true
    } catch (error) {
        console.log("Error findUser: ",error.message)
        return false
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