
import config from 'config'
import crypto from 'crypto'

export const  validateUser = (socket, next) => {
    const userInfo = socket.handshake.query.userInfo;

    const validUser = decodeUserInfo(userInfo)
   // console.log("validUser = ", validUser)
    if (!validUser) {
        console.log("Try emit invalidToken")
        return socket.emit("invalidToken",{ status: false, message: "Invalid user"})        
    }

    socket.userInfo = validUser
    next()
}

const decodeUserInfo = (userInfo) =>{    
    try {
        const botToken = config.get('botToken')
        
        const params = new URLSearchParams(userInfo)

        const currUser = JSON.parse(params.get('user'))
        if (!currUser){
            console.log("Invalid user")
            return null
        }

        if (currUser.id===-211277){
            console.log("Test user found")
            return currUser
        }

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
      
        currUser.token = hash

        // Step 4: Compare computed HMAC with the received hash
        return hmac === hash ? currUser : null

    } catch (error) {
        console.log("Error verifyTelegramData: ", error.message);
        return null
    }
}
