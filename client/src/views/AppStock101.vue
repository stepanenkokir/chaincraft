<template>
    <div id="app-stock"> 
        <h1 class="title-stock">Stock 101 Game</h1> 
        <div class="info-row-stock">
            <div class="info-stock">
                <span class="papirus-cursive">Score: <b>{{ score }}</b></span>
            </div>
            <div class="info-stock">
                <span class="papirus-cursive">Goal: <b> {{ goal }}</b> </span>                    
            </div>
        </div>
        <div class="game-container-stock">
            <ModalViewStock 
                v-if="gameOver"
                :resultInfo="resultInfo"
                @restart-game="startGame"
                @rollback="rollback"
            />

            <ModalViewStock 
                v-if="gameWin"
                :resultInfo="resultInfo" 
                @continue-game="continueGame"   
            />
            <div class="grid-stock">
                <div
                    v-for="cell in grid"
                    :key="cell.index"
                    :class="['cell-stock', cell.color, cell.shift ??'']"
                    @click="handleClick(cell.index)"
                >
                    <div class="cell-stock">
                        <span class="result">{{ cell.result }}</span>
                    </div>   
                </div>
            </div>
        </div>
        <button class="back-button" @click="rollback">Rollback</button>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, watch, onMounted } from 'vue'
    import ModalViewStock from '@/components/ModalViewStock.vue'
    import type {GridCell,NeighbourInfo, ResultInfoStock} from '@/types/Stock101Interface'
    
    const GOAL_STOCK = 10
    const grid = reactive<GridCell[]>([])
     
    const historyStack = ref<GridCell[][]>([]);
    
    const gridSize = 4
    const colors = ['B', 'C', 'D', 'E']
    const goal = ref(GOAL_STOCK)

    const prize = ref(1)

    const score = ref(0)
    const heap = ref(0)
    const overKill = ref(false)
    const gameOver = ref(false)
    const gameWin = ref(false)

    const resultInfo = ref<ResultInfoStock>({
        title       : "ERROR",
        score       : score.value,
        heap        : heap.value,
        overkill    : overKill.value,
        goal        : goal.value   
    })

    watch([score, heap, overKill, goal], () => {
        resultInfo.value.score = score.value
        resultInfo.value.heap = heap.value
        resultInfo.value.overkill = overKill.value
        resultInfo.value.goal = goal.value
    })

    watch([gameOver], () => {
        resultInfo.value.title = "Game Over"
    })

    watch([gameWin], () => {
        resultInfo.value.title = "WIN"
    })

    const startGame = () => {

        resultInfo.value = {
            title       : "ERROR",
            score       : score.value,
            heap        : heap.value,
            overkill    : overKill.value,
            goal        : goal.value 
        }
        
        let findNeighborResult:NeighbourInfo
        gameWin.value =  false
        gameOver.value =  false
        score.value = 0
        heap.value = 0
        goal.value = GOAL_STOCK
        prize.value=1
        overKill.value = false
        do{
            grid.splice(0, grid.length, ...Array.from({ length: gridSize * gridSize }, (_, index) => ({
                index,
                result: 1,
                color: colors[Math.floor(Math.random() *3)],
                shift:null,
                newValue:null,
            })))

            findNeighborResult = findNeighbors()
           // console.log(findNeighborResult.gameOver)
        } while (findNeighborResult.gameOver)             
    }

    // Функция для добавления состояния в стек истории
    const saveHistory = () => {
        // Сохранение копии текущего состояния grid в стек
        historyStack.value.push(JSON.parse(JSON.stringify(grid)));
    }

    const rollback = () =>{
        if (historyStack.value.length > 0) {
            const previousState = historyStack.value.pop(); // Извлекаем последнее сохраненное состояние
            if (previousState) {
                // Восстанавливаем состояние grid
                grid.splice(0, grid.length, ...previousState)
                overKill.value = false
                //score.value = 0
            }
        }

        if ( gameOver.value ){
            gameOver.value =  false
        }
    }


    
    const findNeighbors = () => {
        const checkDirection = [1, -1, gridSize, -gridSize]

        let gameOver = true
        let win=false
        for (let i=0;i<gridSize*gridSize;i++){          
            let count = 0

            checkDirection.forEach((direction) => {
                const neighborIndex = i + direction;
                if (
                    neighborIndex >= 0 && 
                    neighborIndex < grid.length &&
                    (
                        (direction === 1 && neighborIndex % gridSize !== 0) || 
                        (direction === -1 && i % gridSize !== 0) ||
                        Math.abs(direction) === gridSize
                    )
                ) {
                    if (grid[neighborIndex].color === grid[i].color) {
                        count++
                    }
                }
            })
            if (count>0 && !overKill.value){
                gameOver=false
            }

            if (grid[i].result===goal.value){
                win = true
            }

            if (grid[i].result>goal.value){
                overKill.value = true
                gameOver=true
            }
        }

        return {gameOver:gameOver, win:win}
    }


    const newCells = (index:number,sum:number) =>{
       
        grid[index].result=sum
        score.value+=sum

        grid.forEach(cell =>{
            if (cell.newValue){
                cell.result = cell.newValue.result
                cell.color = cell.newValue.color
                cell.newValue = null
                cell.shift = null
                if (!cell.result){
                    cell.result =  1,
                    cell.color = colors[Math.floor(Math.random()*4)]
                    cell.shift = 'new-data'
                }
            }
            if (cell.result>heap.value){
                heap.value=cell.result
            }
        })       
        const findNeighborResult = findNeighbors()

        if (findNeighborResult.gameOver){
            gameOver.value = true
        }

        if (findNeighborResult.win){
            gameWin.value = true

        }
        setTimeout(()=>{
            grid.forEach(cell =>{cell.shift = null})
        },100)
    }

    const continueGame = () =>{
        gameWin.value = false
        goal.value+=GOAL_STOCK
        prize.value*=2
    }

    const handleClick = (index : number) => {
        const cell = grid[index]     
        const currentColor = cell.color
        let sum = cell.result

        saveHistory()

        //check right
        let curr_indx = index+1
        if (curr_indx<gridSize*gridSize && index%gridSize!==3 && grid[curr_indx].color === currentColor){       
            const mX = Math.floor(index / gridSize) *gridSize +gridSize
            sum+=grid[curr_indx].result        
            while(curr_indx < mX){
                grid[curr_indx].shift = 'shift-left'
                grid[curr_indx].newValue = ((curr_indx+1)<mX) ? 
                    {result:grid[curr_indx+1].result, color:grid[curr_indx+1].color }:
                    {result:0, color:null }
                curr_indx++
            }
        }

        //check left
        curr_indx = index-1
        if (curr_indx>=0 && index%gridSize!==0 &&grid[curr_indx].color === currentColor){        
            const mX = Math.floor(index / gridSize) *gridSize
            sum+=grid[curr_indx].result                               
            while(curr_indx>= mX){
                grid[curr_indx].shift = 'shift-right'
                grid[curr_indx].newValue =  ((curr_indx-1)>=mX) ? 
                    {result:grid[curr_indx-1].result, color:grid[curr_indx-1].color }:
                    {result:0, color:null }  
                curr_indx--
            }
        }

        //check up
        curr_indx = index-gridSize
        if (curr_indx>=0 &&grid[curr_indx].color === currentColor){         
            sum+=grid[curr_indx].result                       
            while(curr_indx>=0 ){
                grid[curr_indx].shift = 'shift-up'
                grid[curr_indx].newValue =  ((curr_indx-gridSize)>=0) ? 
                    {result:grid[curr_indx-gridSize].result, color:grid[curr_indx-gridSize].color }:
                    {result:0, color:null }
                curr_indx-=gridSize
            }
        }

        //check down        
        curr_indx = index+gridSize
        if (curr_indx<gridSize*gridSize && grid[curr_indx].color === currentColor){        
            sum+=grid[curr_indx].result                     
            while(curr_indx<gridSize*gridSize ){
                grid[curr_indx].shift = 'shift-down'
                grid[curr_indx].newValue = ((curr_indx+gridSize)<gridSize*gridSize) ? 
                    {result:grid[curr_indx+gridSize].result, color:grid[curr_indx+gridSize].color }:
                    {result:0, color:null }
                curr_indx+=gridSize
            }
        }
        
        if (cell.result!==sum){
            grid[index].color='A'
            setTimeout(newCells,100, index, sum)
        }
       
    }

    
    onMounted(() => {
        startGame()
    })
</script>

<style scoped>



.result {
    font-weight: 800;
    font:bolder;
    font-size: var(--font-min-size);
}

button {
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.papirus-cursive{
    font-family:'Papyrus',    
    /*,cursive*/
}

.A { background-color: #fd0101; }
.B { background-color: #ffa600; }
.C { background-color: #ffee00; }
.D { background-color: #61fe53; }
.E { background-color: #3ddef3; }
.F { background-color: #b71ddd; }
</style>
  