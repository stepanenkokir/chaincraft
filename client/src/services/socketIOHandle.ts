import { io } from 'socket.io-client'
import { useWebAppPopup , useWebApp} from 'vue-tg'
import type { responseServerInfoType } from '@/types/ServerInfoType'

const { showAlert } = useWebAppPopup()

const showAlertInfo = ( message: string) =>{
    try{
        console.log(message)
        showAlert(message)
    }catch(error){
        // Check if the error is an instance of Error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Error in showAlertInfo:", errorMessage)  // Log the error message
    }
}

// URL сервера Socket.IO, возможно, нужно настроить в зависимости от вашего окружения
const SERVER_URL = import.meta.env.VITE_SERVER_URL
const testMode = import.meta.env.VITE_TEST_MODE
let socket: any

// Инициализация соединения с сервером Socket.IO
export const initializeSocketConnection = async () => {

    const { initData } = useWebApp()
    let cInitData = initData    
    if (initData===''){
        console.log("testMode=",testMode)
        if (testMode==='test'){            
            cInitData = "user=%7B%22id%22%3A-211277%2C%22language_code%22%3A%22ru%22%2C%22last_name%22%3A%22Guinea%22%2C%22first_name%22%3A%22Pig%22%2C%22username%22%3A%22Plaksik%22%2C%22token%22%3A%22987654321%22%2C%22balance%22%3A0%7D"
        } else {
            return Promise.reject({
                success : false,
                data    : null,
                message : 'No Telegram'
            })
        }
    }

    socket = io(SERVER_URL, {
        transports: ['websocket'],
        reconnectionAttempts: 3,
        query : {
            userInfo : cInitData
        }
    })

    socket.on('connect', () => {
       //showAlertInfo(`Connected to the server: ${socket.id}`)
    })

    socket.on('disconnect', () => {
        showAlertInfo('Disconnected from the server')
    })

    socket.on('invalidToken', (response: any) => {
        showAlertInfo('INVALID TOKEN')
    })

    socket.on('failMove', ( msg: string ) => {
        showAlertInfo('Incorrect move: '+JSON.stringify(msg))
    })

    socket.on('connect_error', (err: any) => {
        showAlertInfo(`Connection error: ${JSON.stringify(err)}`)
    })

    socket.on('new-user-balance', ( newBalance: number ) => {
        console.log("new-user-balance:", newBalance)
    })

    

    return socket
}

// Функция для загрузки информации о пользователе с сервера
export const checkUser = (): Promise<responseServerInfoType> => {
    return new Promise((resolve, reject) => {
        socket.emit('checkUser', { })
        // Используем socket.once для одноразового прослушивания события
        socket.once('checkUserResponse', (response: any) => {
            if (!response || response.error) {
                return reject({
                    success : false,
                    data    : null,
                    message : response ? response.error : 'Unknown error checkUserResponse'
                })
            }
            resolve({
                success : true,
                data    : response,
                message : null
            })
        })

        socket.once('unknownUser', (response: any) => {
            if (!response || response.error) {
                return reject({
                    success : false,
                    data    : null,
                    message : response ? response.error : 'Unknown error unknownUser'
                })
            }
            resolve({
                success : false,
                data    : response,
                message : "Invalid user"
            })
        })
    })
}

export const startNewFoxGame = (): Promise<any> => {
    console.log("startNewFoxGame")
    return new Promise((resolve, reject) => {
        socket.emit('startNewFoxGame', { })
      
        socket.once('gameCreated', (response: any) => {
            if (!response || response.error) {
                return reject({
                    success : false,
                    data    : null,
                    message : response ? response.error : 'Unknown error gameCreated'
                })
            }
            resolve({
                success : true,
                data    : response,
                message : "New game created"
            })
        })
    })
}

// Функция для проверки результата игры
export const checkFoxResult = (gameId: string, index: number, leftButton: Boolean): Promise<any> => {
  //  console.log("Send promise = ", gameId)
    return new Promise((resolve, reject) => {
        socket.emit('checkFoxResult', { gameId, index, leftButton })
        socket.once('moveMade', (response: any) => {            
            if (!response || response.error) {
                return reject({
                    success : false,
                    data    : null,
                    message : response ? response.error : 'Unknown error moveProcessed'
                })
            }
            resolve({
                success : true,
                data    : response,
                message : "Move Processed"
            })
        })

        socket.once('game_fox_finished', (response: any) => {            
            if (!response || response.error) {
                return reject({
                    success : false,
                    data    : null,
                    message : response ? response.error : 'Unknown error moveProcessed'
                })
            }
            resolve({
                success : true,
                data    : response,
                message : "Move Processed"
            })
        })
    })
}

// Функция для наблюдения за игрой
export const observeGame = (gameId: number, callback: (data: any) => void) => {
    socket.emit('observeGame', { gameId })

    socket.on('gameUpdate', (data: any) => {
        callback(data)
    })
}

// Закрытие соединения
export const closeSocketConnection = () => {
    if (socket) {
        socket.disconnect()
    }
}

const startHandler = () => {
    initializeSocketConnection()
}

startHandler()