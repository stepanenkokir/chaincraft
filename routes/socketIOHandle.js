import { checkToken, createNewFoxGame } from "../services/databaseHandler.js"

export const startIONewFoxGame = async ( data, socket ) =>{
    const { token } = data
    const user = await checkToken( token ) 

    if (!user) {
        socket.emit('error', { message: 'Unauthorized' });
        return
    }
    const foxArr = Array.from(new Set(Array.from({ length: 5 }, () => Math.floor(Math.random() * 100))))
    const game = await createNewFoxGame( foxArr, user.id ) 
    socket.emit('gameStarted', { gameId: game.id })
}

// Обработка события проверки результата через Socket.io
export const checkIOFoxResult  = async ( data, socket ) => {
    const { gameId } = data;
    const game = await GameInitialization.findByPk(gameId)

    if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
    }

    const result = yourFunction(game.foxArr); // Ваша функция обработки

    await game.update({ result, end_time: new Date() });

    socket.emit('result', { result });
}

export const observeIOFoxGame = async (data) => {
    const { gameId } = data;
    const game = await GameInitialization.findByPk(gameId);

    if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
    }

    socket.emit('gameData', { foxArr: game.foxArr, start_time: game.start_time });
}
