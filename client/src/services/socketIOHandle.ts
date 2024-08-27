import { io } from 'socket.io-client'
import { useWebAppPopup , useWebApp} from 'vue-tg'
import type { responseServerInfoType } from '@/types/ServerInfoType'

const { showAlert } = useWebAppPopup()

const showAlertInfo = ( message: string) =>{
    try{
        console.log(message)
        showAlert(message)
    }catch(error){
        console.log("Error showAlertInfo:",error)
    }
}

// URL сервера Socket.IO, возможно, нужно настроить в зависимости от вашего окружения
const SERVER_URL = import.meta.env.VITE_SERVER_URL

let socket: any

// Инициализация соединения с сервером Socket.IO
export const initializeSocketConnection = async () => {
    socket = io(SERVER_URL, {
        transports: ['websocket'],
        reconnectionAttempts: 3,
    })

    socket.on('connect', () => {
       //showAlertInfo(`Connected to the server: ${socket.id}`)
    })

    socket.on('disconnect', () => {
        showAlertInfo('Disconnected from the server')
    })

    socket.on('connect_error', (err: any) => {
        showAlertInfo(`Connection error: ${JSON.stringify(err)}`)
    })

    return socket
}

// Функция для загрузки информации о пользователе с сервера
export const checkUser = (): Promise<responseServerInfoType> => {

    const { initData } = useWebApp()

    console.log("ID ", initData)
    if (initData===''){
        return Promise.reject({
            success : false,
            data    : null,
            message : 'No Telegram'
        })
    }

    return new Promise((resolve, reject) => {
        socket.emit('checkUser', { initData:initData })
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

        socket.once('invalidToken', (response: any) => {
            if (!response || response.error) {
                return reject({
                    success : false,
                    data    : null,
                    message : response ? response.error : 'Unknown error invalidToken'
                })
            }
            resolve({
                success : false,
                data    : response,
                message : "Invalid token"
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

            // resolve({
            //     success : true,
            //     data    : {
            //         user_id     : -1,
            //         lang        : 'ru',
            //         user_name   : 'Tester', 
            //         balance     : 876,
            //         first_time  : true
            //     },
            //     message : "Invalid user"
            // })
        })
    })
}

export const startNewFoxGame = (userInfo: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        socket.emit('startNewFoxGame', { userInfo }, (response: any) => {
            if (response.error) {
                return reject(response.error)
            }
            resolve(response.data)
        })
    })
}

// Функция для проверки результата игры
export const checkFoxResult = (gameId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        socket.emit('checkFoxResult', { gameId }, (response: any) => {
            if (response.error) {
                return reject(response.error)
            }
            resolve(response.data)
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

// Убедитесь, что инициализация сокета вызывается в нужное время
initializeSocketConnection()
