import { findOrCreateUser } from "../services/databaseHandler.js"

export const checkUser = async ( socket ) => {
    const validUser = socket.userInfo

    const findUser = await findOrCreateUser( validUser )
    if (findUser){
        socket.emit('checkUserResponse', {
            status      : true,
            user_id     : findUser.data.user_id,
            lang        : findUser.data.language_code,
            user_name   : `${findUser?.data.first_name ? findUser.data.first_name : findUser.data.username }`, 
            balance     : findUser.data.total_balance,
            first_time  : findUser.first_time,
            result_info : findUser.resultInfo
        })
    } else {
        return socket.emit('unknownUser', { status:false, message:`Invalid user ${JSON.stringify(validUser)}`})
    }
}
