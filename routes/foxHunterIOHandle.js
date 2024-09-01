import crypto from 'crypto';
import { Redis } from 'ioredis';

const redis = new Redis();

// Функция для генерации уникального ID игры
const generateUniqueId = () => {
    return crypto.randomUUID();
};

// Функция для генерации начального состояния поля
const generateInitialField = () => {
    const foxArray = [];
    while (foxArray.length < 5) {
        const rndFox = Math.floor(Math.random() * 100);
        if (!foxArray.includes(rndFox)) {
            foxArray.push(rndFox);
        }
    }
    return foxArray;
};

// Функция для старта новой игры
export const startNewFoxGame = async (socket) => {
    console.log("START FOX GAME")
    const gameId = generateUniqueId(); // Генерируем уникальный ID игры
    const foxArray = generateInitialField(); // Генерируем начальное расположение лис

  //  console.log("gameId",gameId,"foxArray",foxArray)

    // Создаем начальное состояние игры
    const gameState = {
        foxArray,                   // Массив с позициями лис
        moves: [],                  // История ходов
        spectators: [],             // Список наблюдателей
        gameState: 'active',        // Текущее состояние игры (например, active, finished)
    };

    // Инициализируем поле в Redis (все клетки изначально "unchecked")
    const fieldKey = `game:${gameId}:field`;
    for (let i = 0; i < 100; i++) {
        await redis.hset(fieldKey, i, 'unchecked');
    }

    // Сохраняем начальное состояние игры в Redis
    await redis.set(`game:${gameId}:state`, JSON.stringify(gameState));
    // Время жизни игры в базе - 1 час
    await redis.expire(`game:${gameId}:state`, 3600); 
    // Присоединяем игрока к комнате
   // console.log(gameState)
    socket.join(gameId);
    socket.emit('gameCreated', { gameId });
};

// Функция для обработки хода игрока
export const handlePlayerMove = async (socket, { gameId, index, leftButton }) => {
   
    const fieldKey = `game:${gameId}:field`;
    const gameStateKey = `game:${gameId}:state`;

    // Загружаем текущее состояние игры
    const gameState = JSON.parse(await redis.get(gameStateKey));   

    // Проверяем, находится ли игра в активном состоянии
    if (gameState.gameState !== 'active') {
        socket.emit('error', { message: 'Game is not active.' });
        return;
    }   
    // Определяем новое состояние клетки
    let newStatus;
    if (leftButton) {
        const foxNearby = gameState.foxArray.includes(index);
        const revealedValue = calculateFoxProximity(index, gameState.foxArray)
        newStatus = `${index}_${leftButton}_${revealedValue}_${foxNearby}`

        // Добавляем ход в историю
        gameState.moves.push(newStatus)
       // console.log(gameState)

        //Проверяем лис
        if (foxNearby) {           
            if (gameState.moves.filter(it=>it.endsWith('_true')).length === 5) {
                gameState.gameState = 'finished' // Завершаем игру, если найдены все лисы
            }
        }
    } else {
        // Обработка нажатия правой кнопки (пометка клетки)
        const currentStatus = await redis.hget(fieldKey, index);
        newStatus = currentStatus === 'checked' ? 'unchecked' : 'checked';
    }

    // Обновляем состояние клетки в Redis
    await redis.hset(fieldKey, index, newStatus);

    // Обновляем состояние игры в Redis
    await redis.set(gameStateKey, JSON.stringify(gameState));

    // Отправляем обновление клиенту
    socket.emit('moveMade', { index, status: newStatus });

    // Оповещаем всех участников комнаты о новом ходе
    socket.to(gameId).emit('updateField', { index, status: newStatus });

    // Если игра закончена, уведомляем игроков
    if (gameState.gameState === 'finished') {
        socket.emit('gameFinished', { gameId })
        socket.to(gameId).emit('gameFinished', { gameId })
        // todo store result to MySQL
    }
}

// Функция для расчета количества лис вокруг клетки
const calculateFoxProximity = (index, foxArray) => {
    const directions = [-1, 1, 9, 10, 11, -9, -10, -11]
    let count = 0
    directions.forEach((dir) => {
        let pos = index + dir
        while (pos >= 0 && pos < 100 
            && Math.floor(pos / 10) === Math.floor((pos - dir) / 10) + Math.sign(dir) * (Math.abs(dir) >= 9 ? 1 : 0)) {
            if (foxArray.includes(pos)) {
                count++
                break
            }
            pos += dir
        }
    })

    return count
}
