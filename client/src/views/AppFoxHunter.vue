<template>
    <div id="appFox">
        <h1 class="titleFox"> {{ t('fox_hunt_game') }}</h1> 
        <div class="info-row">
            <div class="info">
                <span class="papirus-cursive">{{ t('time') }}: <b>{{ formattedGameTime }}</b></span>               
            </div>
            <div class="info">
                <span class="papirus-cursive">{{ t('clicks') }}: <b>{{ clicks }}</b></span>              
            </div>
        </div>
        <div class="rowOfIcon">
            <img 
                v-for="n in 5" 
                :key="n" 
                src="@/assets/waiting_fox.png" 
                :class="[findedFox>=n ? '' : 'grayscale']"
                alt="Fox Icon" 
            />
        </div>
        <div class="game-container">
            <ModalViewFox 
                v-if="gameWon"
                :resultInfo="resultInfo" 
                @finish-game="finishGame"
            />

            <div class="gridFox">
                <div
                    v-for="cell in grid"
                    :key="cell.index"
                    :class="[
                        'cellFox', 
                        cell.clicked ? 'clicked' : '',                        
                        cell.withFox ? 'withFox' : '',
                        cell.findBlink ? 'findBlink' : '',
                        cell.flagged ? 'flagged' : '',
                    ]"
                    @click="handleClick(cell.index)"
                    @contextmenu.prevent="handleRightClick(cell.index)"
                >
                    <span v-if="cell.withFox" :class="[cell.index % 10 > 5 ? 'fox-sprite-reverse' : 'fox-sprite-forward']"/>
                    <div>
                        <span v-if="cell.flagged" class="flag">❌</span>
                        <span v-if="cell.clicked" class="result">{{ cell.result }}</span>
                    </div>
                </div> 
            </div>
        </div>
       
        <button 
            class="start-button papirus-cursive" 
            @click="startGame"
            >
            {{ t('restart_new_game') }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { startNewFoxGame, checkFoxResult } from '../services/socketIOHandle'
import type { GridCell, ResultInfo } from '@/types/FoxHunterInterface';
import ModalViewFox from '@/components/ModalViewFox.vue';
import { useI18n } from 'vue-i18n'    
import { useServerInfoStore } from '../stores/serverInfoStore'  
const { t, locale } = useI18n()
const serverInfoStore = useServerInfoStore()

const grid = reactive<GridCell[]>([])
const gameWon = ref(false)
const clicks = ref(0)
const findedFox = ref(0)
const timerFoxGame = ref< number | null>(null);
const gameTime = ref(0)
const totalWin = ref(false)
const firstClick = ref(true)
const gameId = ref<string|null>(null)
const resultInfo = ref<ResultInfo>({
    time: 0,
    count: 0,
    score : 0
})

const formattedGameTime = computed(() => {
    const minutes = Math.floor(gameTime.value / 60);
    const seconds = gameTime.value % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
})

const clearFindBlink = () => {
    grid.forEach(cell => {cell.findBlink=false }) 
}

const finishGame = () =>{
    gameWon.value = false
    totalWin.value = true
}

const startGame = async () => {
    resultInfo.value = {
        time: 0,
        count: 0,
        score : 0
    }
    gameWon.value = false
    clicks.value = 0
    totalWin.value = false
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
                withFox: false,
                findBlink: false 
            }))
    )
}

const handleClick = async ( index: number ) => {

    fillGrid( index, 'find')
    setTimeout( () => {clearFindBlink()}, 500 )

    if ( grid[index].clicked || gameWon.value || totalWin.value ){
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

    const moveResult = await checkFoxResult( gameId.value, index, true)
   // console.log("Result moveResult ",moveResult)
    if (!moveResult.success){
        return console.error("Error moveResult ", moveResult.message)
    }

    const decodeResult = moveResult.data.status.split('_')
 
    const data = {
        visibleFoxes : decodeResult[3], 
        result       : decodeResult[4]==="true" ? "fox" : null
    }

    grid[index].clicked = true
    grid[index].flagged = false
    grid[index].result = data.visibleFoxes
    if (data.result === 'fox') {
        findedFox.value++
        grid[index].withFox = true
    } 

    if ( data.visibleFoxes === "0" ){   
        fillGrid( index, 'flag' )
    }
    
    if (moveResult.data.state==="finished") {
        if (timerFoxGame.value !== null) {
            clearInterval(timerFoxGame.value)
        }
        resultInfo.value = moveResult.data.resultInfo
        gameWon.value = true
    } 
}

const fillGrid = ( index:number, type:string="" ) => {
    if (type===""){
        return
    }

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
            if (type==="flag"){
                if ( !grid[pos].clicked ){
                    grid[pos].flagged = true
                }
            }

            if (type==="find"){
                grid[pos].findBlink = true                
            }
            
            pos += dir
        }
    })
}

const handleRightClick = async ( index:number ) => {   
    if ( totalWin.value || firstClick.value){
        return
    }

    if (!gameId.value) {
        console.error("No gameId :o(")
        return 
    }

    const moveResult = await checkFoxResult( gameId.value, index, false)
    grid[index].flagged = !grid[index].flagged
}

onMounted(() => {
    locale.value = serverInfoStore.locale 
    startGame()
})
</script>

<style scoped>

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
}

.flagged{
    background-color:rgb(146, 128, 84); 
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

</style>
