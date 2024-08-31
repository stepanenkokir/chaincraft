<template>
    <div id="appStock"> 
        <h1 class="titleStock">Stock 101 Game</h1> 
        <div class="info-row">
            <div class="info">
                <span class="papirus-cursive">Score: <b>{{ score }}</b></span>
            </div>
            <div class="info">
                <span class="papirus-cursive">Goal: <b> {{ goal }}</b> </span>                    
            </div>
        </div>
        <div class="game-container">
            <div class="grid">
            <div
                v-for="cell in grid"
                :key="cell.index"
                :class="['cell', cell.color, cell.shift ??'']"
                @click="handleClick(cell.index)"
            >
                <div class="cell">
                    <span class="result">{{ cell.result }}</span>
                </div>   
            </div>
            </div>
        </div>
        <div v-if="gameOver" class="modal-overlay">
            <div class="modal">
                <h2>GAME OVER</h2>
                <h3>{{ (overKill ? `Over limit ${goal}` : 'No moves left') }}</h3>
                <h3>SCORE {{ score }}</h3>
                <h3>HEAP {{ heap }}</h3>
                <h5>BEST SCORE {{ bestScore }}</h5>
                <h5>MAX HEAP {{ maxHeap }}</h5>
                <button @click="startGame">RESTART</button>
            </div>
        </div>
        <div v-if="gameWin" class="modal-overlay">
            <div class="modal">
                <h2>WIN</h2>
                <h3>You have earned {{ prize }} megacoin</h3>
                <h5>If you collect a stack of {{ (goal+GOAL_STOCK) }}, you'll receive an additional {{ 2*prize }} coins.</h5>
                <button @click="continueGame">Continue</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted } from 'vue'

    interface newValue {
        result  : number;
        color   : string | null;
    }
    interface GridCell {
        index   : number;
        result  : number;
        color   : string | null;
        shift   : string | null;
        newValue: newValue |null;
    }

    interface neighbourInfo {
        gameOver    : boolean;
        win         : boolean
    }
    
    const GOAL_STOCK = 101
    const grid = reactive<GridCell[]>([])
    const gridSize = 4
    const colors = ['A', 'B', 'C', 'E']
    const goal = ref(GOAL_STOCK)

    const prize = ref(1)

    const score = ref(0)
    const heap = ref(0)
    const bestScore = ref(4043)
    const maxHeap = ref(178)
    const overKill = ref(false)
    const gameOver = ref(false)
    const gameWin = ref(false)

    const startGame = () => {
        
        let findNeighborResult:neighbourInfo
        gameOver.value =  false
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
            console.log(findNeighborResult.gameOver)
        } while (findNeighborResult.gameOver)             
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
            grid[index].color='D'
            setTimeout(newCells,100, index, sum)
        }
    }

    onMounted(() => {
        startGame()
    })
</script>

<style scoped>

#appStock{
    text-align: center;
    user-select: none;
}

.titleStock{
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

.grid {
    display: grid;
   
    grid-template-columns: repeat(4, var(--cell-stock-size));
    gap: var(--gap-stock-size);
    justify-content: center;
    user-select: none;
    margin: 0 auto;
    width: var(--grid-fox-width);
    border-radius: 3px;
}

.cell {
    font-size: 2em;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    border-radius: 10%;
    
    aspect-ratio: 1;
}

.result {
    font-weight: 800;
    font:bolder;
    font-size: var(--font-min-size);
}

.cell {
    min-width: var(--cell-stock-size);
    min-height: var(--cell-stock-size);
}

.shift-left { will-change: transform; animation:  move-left 0.1s linear forwards;}
@keyframes move-left {
    0% { transform: translateX(0); }
    100% { transform: translateX( calc(-1 * var(--cell-stock-size) - var(--gap-stock-size)) ); }
}

.shift-right {  will-change: transform; animation:  move-right 0.1s linear forwards;}
@keyframes move-right {
    0% { transform: translateX(0);}
    100% { transform: translateX( calc(var(--cell-stock-size) + var(--gap-stock-size)) ); }
}

.shift-up {  will-change: transform; animation:  move-up 0.1s linear forwards; }
@keyframes move-up {
    0% { transform: translateY(0);}
    100% { transform: translateY( calc(var(--cell-stock-size) + var(--gap-stock-size)) ); }
}

.shift-down {  will-change: transform; animation:  move-down 0.1s linear forwards; }
@keyframes move-down {
    0% { transform: translateY(0);}
    100% { transform: translateY( calc(-1 * var(--cell-stock-size) - var(--gap-stock-size)) ); }
}

.new-data {  will-change: transform; animation:  new-data 0.1s linear forwards;}
@keyframes new-data {
    0% { transform:scale(0) }
    100% { transform:scale(1) }
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
  align-items: center;
  z-index: 1000;
}

.modal {
  background: rgb(204, 204, 204);
  width: 200px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  will-change: transform;
  animation: grow 0.1s ease-in-out;
}

@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
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


.A { background-color: #fdf2bc; }
.B { background-color: #357978; }
.C { background-color: #ec5072; }
.D { background-color: #fef653; }
.E { background-color: #f3ab3d; }
</style>
  