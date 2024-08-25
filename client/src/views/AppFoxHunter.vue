<template>
    <div id="appFox">
        <h1>Fox Hunt Game</h1> 
        <div class="info-row">
            <div class="info">
                <span class="papirus-cursive">Time: <b>{{ formattedGameTime }}</b></span>               
            </div>
            <div class="info">
                <span class="papirus-cursive">Clicks: <b>{{ clicks }}</b></span>              
            </div>
        </div>
        <div class="game-container">
            <div v-if="gameWon" class="congratulations">
                You won the game in {{ formattedGameTime }} and {{ clicks }} clicks.
                <div class="pyro">
                    <div class="before"></div>
                    <div class="after"></div>
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
                    <div class="cellFox">
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
    gameTime.value =0
    firstClick.value=true

   // await fetch('/start')
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

    if ( firstClick.value ){
        timerFoxGame.value = setInterval( () => {
            gameTime.value += 1
        }, 1000 )
        firstClick.value = false
    }

    clicks.value++
    const response = await fetch( `/check/${index}` )
    const data = await response.json()
    grid[index].clicked = true
    grid[index].result = data.visibleFoxes
    if (data.result === 'fox') {
        findedFox.value++
        grid[index].withFox = true
     //   grid[index].result =  '🐺 ' + data.visibleFoxes
    } 

    if ( data.visibleFoxes === 0 ){
        fillFlagged( index )
    }
    
    if (findedFox.value === 5) {
        if (timerFoxGame.value !== null) {
            clearInterval(timerFoxGame.value);
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
}

.info-row {
    display: flex;
    justify-content: space-between;
    width: var(--grid-fox-width);
}

.info {
    width: 40%;
    font-size: 1.5em;
    background: linear-gradient(to bottom, #23c79c, #fff323);
    border-radius: 25px;
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
}
.papirus-cursive{
    font-family:'Papyrus',    
    /*,cursive*/
}
</style>
