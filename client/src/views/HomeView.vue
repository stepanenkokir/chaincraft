<template>
    <div class="appMain">
        <div class="button-container">
            <div class="info-row">
                <div class="info">
                    <div class="papirus-cursive">{{ t('rank') }}: <span class="main-span">{{ currentRank }}</span></div>
                </div>
                <div class="info">
                    <div class="papirus-cursive">{{ t('balance') }}: <span class="main-span">{{ totalBalance }}</span></div>
                </div>
            </div>
            <div 
                v-for="(game, index) in games" 
                :key="game.id" 
                class="vertical-button-div"
                >
                <button class="vertical-button" @click="startGame(game.id)">
                <h2>{{ game.name }}</h2>
                <h5>{{ gameResult(game.id) }}</h5>
                </button>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">   
    import { getRankInfo } from '@/services/RankInfo';
    import { useServerInfoStore } from '../stores/serverInfoStore'
    import type {ServerInfoType} from '@/types/ServerInfoType'
    import { onBeforeMount, ref, computed } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t, locale } = useI18n()

    const games = [
        { id: 1, name: 'Stock101' },
        { id: 2, name: 'FoxHunter' },
        { id: 3, name: 'Tic Tac Toe' },
    ]

    const serverInfoStore = useServerInfoStore()

    const user = ref<ServerInfoType | null>(null)

    const emit = defineEmits(['select-game'])

    const totalBalance = ref(0)

    const currentRank = computed(() => {
        const currRank = getRankInfo(totalBalance.value) 
        //console.log("My Ballance = ",totalBalance.value, "Rank = ", currRank )     
        return t(currRank)
    })

    // Получаем результат игры из serverInfoStore
    const gameResult = computed(() => {
        return (id: number) => {
            const game = serverInfoStore.gameResults.find(g => g.id === id)
            return game ? game.result : 0
        }
    })

    const startGame = ( id:number ) => {
        emit('select-game',id)
    }

    onBeforeMount(()=>{
      user.value = serverInfoStore.serverInfo
     // console.log("Load ",user.value)
      locale.value = user.value?.lang ? user.value.lang : 'en'
      //console.log("CURRENT USER = ", user.value)
      totalBalance.value = user.value?.balance ? user.value?.balance : 0
    })


</script>
<style scoped>
#appMain{
    text-align: center;
    user-select: none;
}

.title{
    user-select: none;
    font-family: "Bradley Hand", cursive;
    font-size : 2.5em;
    margin-bottom: 10px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    width: 80%;
    user-select: none;
}

.info {
    width: 45%;
    font-size: 1.1em;
    background: linear-gradient(to bottom, #23c79c, #fff323);
    border-radius: 25px;
    user-select: none;
    text-align: center;
}
.papirus-cursive{
    font-family:'Papyrus',    
    /*,cursive*/
}
.main-span{
    font-weight: 800;
}

.button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 70vh;
    justify-content: space-around;
}

.vertical-button {
    width: 100%;    
    font-size: 1.5rem;
    border: none;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    border-radius: 25px;
}

.vertical-button:hover {
    background-color: #45a049;
}

.vertical-button-div {
    width: 90%; 
}
</style>


