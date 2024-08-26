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

    const { initData } = useWebApp()

    const initDataStr = initData&&initData.length>1 ? initData : "query_id=AAEBgcVCAAAAAAGBxUJDNiGU&user=%7B%22id%22%3A1120239873%2C%22first_name%22%3A%22Kirill%22%2C%22last_name%22%3A%22Stepanenko%22%2C%22username%22%3A%22stekiva%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1724630102&hash=d58be3e5effcf2b829d38a7efafc878aa4397a4adac583590399e79c1aef2582"
    return new Promise((resolve, reject) => {       
        socket.emit('checkUser', { initData:initDataStr })
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
