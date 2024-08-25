import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import config from 'config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { setUser } from './routes/routes.js'
import { startIONewFoxGame, checkIOFoxResult, observeIOFoxGame, checkUser } from './routes/socketIOHandle.js'
import { createAllDB } from './models/index.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Настройте CORS согласно требованиям безопасности
    },
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const PORT =  config.has('port')? config.get('port'): 50007

app.use(express.static(path.join(__dirname, 'client', 'dist')))

app.post('/setuser', setUser)

// Socket.io обработчики
io.on('connection', (socket) => {
    console.log('Новый клиент подключился:', socket.id)

    socket.on('checkUser', checkUser)

    // Обработка события старта игры через Socket.io
    socket.on('startNewFoxGame', startIONewFoxGame)

    // Обработка события проверки результата через Socket.io
    socket.on('checkFoxResult', checkIOFoxResult) 
    
    // Обработка события наблюдения за игрой через Socket.io
    socket.on('observeGame', observeIOFoxGame)

    socket.on('disconnect', () => {
        console.log('Клиент отключился:', socket.id);
    })
})

// Запуск сервера
httpServer.listen(config.port, () => {
    console.log(`Сервер запущен на порту ${config.port}`)
})

const createDB = config.has('createDB') ? config.get('createDB') : false
if (createDB){
    await createAllDB()
}