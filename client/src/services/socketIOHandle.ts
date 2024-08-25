import { io } from 'socket.io-client'
import { useWebAppPopup , useWebApp} from 'vue-tg'
import type { ServerInfoType } from '@/types/ServerInfoType'

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

let socket: any;

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
export const checkUser = (): Promise<ServerInfoType> => {

    const { initDataUnsafe, initData } = useWebApp()  
    return new Promise((resolve, reject) => {       
        socket.emit('checkUser', { userInfo: initDataUnsafe?.user, initData:initData })
        // Используем socket.once для одноразового прослушивания события
        socket.once('checkUserResponse', (response: any) => {
            if (!response || response.error) {
                return reject(response ? response.error : 'Unknown error')
            }
            resolve(response)
        })

        socket.once('invalidToken', (response: any) => {
            if (!response || response.error) {
                return reject(response ? response.error : 'Unknown error')
            }
            resolve(response)
        })

        socket.once('unknownUser', (response: any) => {
            if (!response || response.error) {
                return reject(response ? response.error : 'Unknown error')
            }
            resolve(response)
        })
    })
}

export const startNewFoxGame = (userInfo: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        socket.emit('startNewFoxGame', { userInfo }, (response: any) => {
            if (response.error) {
                return reject(response.error);
            }
            resolve(response.data);
        });
    });
};

// Функция для проверки результата игры
export const checkFoxResult = (gameId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        socket.emit('checkFoxResult', { gameId }, (response: any) => {
            if (response.error) {
                return reject(response.error);
            }
            resolve(response.data);
        });
    });
};

// Функция для наблюдения за игрой
export const observeGame = (gameId: number, callback: (data: any) => void) => {
    socket.emit('observeGame', { gameId });

    socket.on('gameUpdate', (data: any) => {
        callback(data);
    });
};

// Закрытие соединения
export const closeSocketConnection = () => {
    if (socket) {
        socket.disconnect();
    }
};

// Убедитесь, что инициализация сокета вызывается в нужное время
initializeSocketConnection();
