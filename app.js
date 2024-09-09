import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import config from 'config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { checkUser } from './routes/socketIOHandleAPI.js'
import { startNewFoxGame, handlePlayerMove } from './routes/foxHunterIOHandle.js'
import { createAllDB } from './models/index.js'
import {validateUser} from "./middleware/validateTelegramUser.js"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Настройте CORS согласно требованиям безопасности
    },
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'client', 'dist')))

io.use(validateUser)

// Socket.io обработчики
io.on('connection', (socket) => {
    console.log('Новый клиент подключился:', socket.id)

    socket.on('checkUser', () => checkUser(socket))

    //-------------- FOX HUNTER ------------------------------
    socket.on('startNewFoxGame',() => startNewFoxGame(socket))

    socket.on('checkFoxResult', ( data ) => handlePlayerMove(socket, data))

   // socket.on('joinFoxGame', ( gameId ) => handleJoinGame( socket, gameId ))

    //socket.on('endFoxGame', ( gameId ) => handleEndGame( gameId ))

    //---------------  STOCK 101  -------------------------------

    //--------------- TIC TAC TOE -------------------------------

    socket.on('disconnect', () => {
        console.log('Клиент отключился:', socket.id)
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