<template>
    <div id="appFox">
        <h1 class="titleFox">Fox Hunt Game</h1> 
        <div class="info-row">
            <div class="info">
                <span class="papirus-cursive">Time: <b>{{ formattedGameTime }}</b></span>               
            </div>
            <div class="info">
                <span class="papirus-cursive">Clicks: <b>{{ clicks }}</b></span>              
            </div>
        </div>
        <div class="game-container">
            <div v-if="gameWon" class="modal-overlay">
                <div class="pyro">
                    <div class="before"></div>
                    <div class="after"></div>
                </div>
                <div class="modal">
                    <h2>WIN</h2>
                    <h3>You won the game in {{ formattedGameTime }} and {{ clicks }} clicks.</h3>
                    <button class="start-button papirus-cursive" @click="startGame">OK</button>
                </div>
            </div>
            <div class="gridFox">
                <div
                    v-for="cell in grid"
                    :key="cell.index"
                    :class="['cellFox', cell.clicked ? 'clicked' : '', cell.flagged ? 'flagged' : '', cell.withFox ? 'withFox' : '']"
                    @click="handleClick(cell.index)"
                    @contextmenu.prevent="handleRightClick(cell.index)"
                >
                    <div>
                        <span v-if="cell.flagged" class="flag">❌</span>
                        <div v-if="cell.withFox" class="winCell">
                            <span class="sprite" />
                        </div>
                        <span v-if="cell.clicked" class="result">{{ cell.result }}</span>
                    </div>             
                </div> 
            </div>
        </div>
       
        <button class="start-button papirus-cursive" @click="startGame">Restart New Game</button>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { startNewFoxGame, checkFoxResult } from '../services/socketIOHandle'

// Types
interface GridCell {
    index: number;
    clicked: boolean;
    result: string;
    flagged: boolean;
    withFox: boolean;
}

const grid = reactive<GridCell[]>([])
const gameWon = ref(false)
const clicks = ref(0)
const findedFox = ref(0)
const timerFoxGame = ref< number | null>(null);
const gameTime = ref(0)
const firstClick = ref(true)
const gameId = ref<string|null>(null)

const formattedGameTime = computed(() => {
    const minutes = Math.floor(gameTime.value / 60);
    const seconds = gameTime.value % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
})

const startGame = async () => {
    gameWon.value = false
    clicks.value = 0
    findedFox.value = 0
    if (timerFoxGame.value !== null) {
        clearInterval(timerFoxGame.value);
    }    
    gameTime.value = 0
    firstClick.value = true
   
    const resultNewGame = await startNewFoxGame()

    if (!resultNewGame.success){
        return console.error("Can't create new game ", resultNewGame.message)
    }

    gameId.value = resultNewGame.data.gameId

  //  console.log("NEW GAME",gameId )

    grid.splice(0, grid.length, ...Array.from(
        { length: 100 }, 
        (_, index) => (
            { 
                index, 
                clicked: false, 
                result: '', 
                flagged: false, 
                withFox: false 
            }))
    )
}

const handleClick = async ( index: number ) => {
    if ( grid[index].clicked || gameWon.value ){
        return
    } 

    if (!gameId.value) {
        console.error("No gameId :o(")
        return 
    }

    if ( firstClick.value ){
        if (timerFoxGame.value){
            clearInterval(timerFoxGame.value)
        }
        timerFoxGame.value = setInterval( () => {
            gameTime.value += 1
        }, 1000 )
        firstClick.value = false
    }

    clicks.value++
   
    // const response = await fetch( `/check/${index}` )
  //  console.log("Click ", gameId.value, index)

    const moveResult = await checkFoxResult( gameId.value, index, true)
   // console.log("Result moveResult ",moveResult)
    if (!moveResult.success){
        return console.error("Error moveResult ", moveResult.message)
    }    
    const decodeResult = moveResult.data.status.split('_')
  
    const data = {
        visibleFoxes : decodeResult[2], 
        result       : decodeResult[3]==="true" ? "fox" : null
    }

    grid[index].clicked = true
    grid[index].result = data.visibleFoxes
    if (data.result === 'fox') {
        findedFox.value++
        grid[index].withFox = true
       // grid[index].result =  '🐺 ' + data.visibleFoxes
    } 

    if ( data.visibleFoxes === 0 ){
        fillFlagged( index )
    }
    
    if (findedFox.value === 5) {
        if (timerFoxGame.value !== null) {
            clearInterval(timerFoxGame.value)
        }
        gameWon.value = true;
    }
}

const fillFlagged = ( index:number ) => {
    const directions = [
        -1, 1, -10, 10, -11, -9, 9, 11,
    ]

    directions.forEach( ( dir ) => {
        let pos = index + dir
        while ( pos >= 0 && pos < 100 ) {
            // Проверка на то, не выходит ли позиция за границы строки по горизонтали
            if ( Math.abs( dir ) === 1 && Math.floor( pos / 10 ) !== Math.floor( index / 10 )) {
                break
            }
            // Проверка на то, не выходит ли позиция за границы строки по диагонали
            if (( dir === -11 || dir === 9 ) && ( pos % 10 > index % 10 )) {
                break
            }
            if (( dir === -9 || dir === 11 ) && ( pos % 10 < index % 10 )) {
                break
            }
            if ( !grid[pos].clicked ){
                grid[pos].flagged = true
            }
            pos += dir
        }
    })
}

const handleRightClick = ( index:number ) => {
    console.log("handleRightClick!!!")
    if ( grid[index].clicked ){
        return
    }
    grid[index].flagged = !grid[index].flagged
}

onMounted(() => {
    startGame()
})
</script>

<style scoped>
#appFox{
    text-align: center;
    user-select: none;
}

.titleFox{
    user-select: none;
    font-family: "Bradley Hand", cursive;
    font-size : 2.5em;
    margin-bottom: 10px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    width: var(--grid-fox-width);
    user-select: none;
}

.info {
    width: 40%;
    font-size: 1.5em;
    background: linear-gradient(to bottom, #23c79c, #fff323);
    border-radius: 25px;
    user-select: none;
}

.game-container {
    display: inline-block;
    margin-top: 20px;
}

.gridFox {
    display: grid;
    grid-template-columns: repeat(10, var(--cell-fox-size));
    gap: var(--gap-fox-size);
    justify-content: center;
    user-select: none;
    margin: 0 auto;
    width: var(--grid-fox-width);
}

.cellFox {
    font-size: 2em;
    position: relative;
    width: var(--cell-fox-size);
    height: var(--cell-fox-size);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #000;
    background-color:rgb(255, 209, 93);
    border-radius: 1px;
    cursor: pointer;
    user-select: none;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); 
    transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.withFox {
    background-color:rgb(245, 40, 119); 
}

.flagged{
    background-color:rgb(146, 128, 84); 
}

.cellFox:active {
    transform: translateY(1px); 
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2); 
}

.start-button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 1.5em;
    font-weight: 800;
    cursor: pointer;
    width: 100%;
    max-width: var(--grid-fox-width);
    background: linear-gradient(to bottom, #23c79c, #fff323); 
    border-radius: 25px;
    user-select: none;
}
.papirus-cursive{
    font-family:'Papyrus',    
    /*,cursive*/
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    /*align-items: center;*/
    z-index: 1000;
}

.modal {
    background: rgb(204, 204, 204);
    width: 90vw;
    height: 20vh;
    padding: 20px;
    margin: 20%;
    border-radius: 10px;
    text-align: center;
    will-change: transform;
    animation: grow 0.1s ease-in-out;
}

.flag {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}

.result {
    position: absolute;
    top: 50%;
    left: 50%;    
    transform: translate(-50%, -50%);
    z-index: 2; /* значение больше, чем у flag */
    pointer-events: none; /* чтобы клики не проходили сквозь */
}

.start-button {
    display: block;
    margin: 10px auto;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    width: 100%;
    max-width: calc(var(--cell-size) * 10 + 45px); /* Match the width of the grid */
}

.sprite {   
    width: 50px; 
    height: 50px;
    background: url('@/assets/run_fox_frame.png') no-repeat;
    animation: play 0.5s steps(6) infinite, move 2s linear forwards;
    z-index: 2000;
}
@keyframes play {
    0% { background-position: 0 0; }
   
    100% { background-position: -300px 0; } 
}
@keyframes move {
    0% { transform: translateX(0); opacity: 1;}
    90% { transform: translateX(200px); opacity: 1;}
    100% { transform: translateX(250px); opacity: 0; }
} 

</style>
