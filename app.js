import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import config from 'config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { checkUser, startNewFoxGame, handleSelectField, handleJoinGame, handleEndGame } from './routes/socketIOHandle.js'
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

// Socket.io обработчики
io.on('connection', (socket) => {
    console.log('Новый клиент подключился:', socket.id)

    socket.on('checkUser', (userInfo) => checkUser(socket, userInfo))

    socket.on('startNewFoxGame',() => startNewFoxGame(socket))

    socket.on('checkFoxResult', ( data ) => handleSelectField(socket, io, data))

    socket.on('joinFoxGame', ( gameId ) => handleJoinGame( socket, gameId ))

    socket.on('endFoxGame', ( gameId ) => handleEndGame( gameId ))

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