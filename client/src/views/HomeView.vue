<template>
    <div class="appMain">
        <div class="button-container">
            <div class="info-row">
                <div class="info">
                    <div class="papirus-cursive">{{ t('Rating') }}: <span class="main-span">Newbie</span></div>
                </div>
                <div class="info">
                    <div class="papirus-cursive">{{ t('balance') }}: <span class="main-span">{{ totalBalance }}</span></div>
                </div>
            </div>
            <button class="vertical-button" @click="startGame(1)">Stock101</button>
            <button class="vertical-button" @click="startGame(2)">FoxHunter</button>
            <button class="vertical-button" @click="startGame(3)">Tic Tac Toe</button>
        </div>
    </div>
</template>
  
<script setup lang="ts">   
    import { useServerInfoStore } from '../stores/serverInfoStore'
    import type {ServerInfoType} from '@/types/ServerInfoType'
    import { onBeforeMount, ref } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t, locale } = useI18n()

    const serverInfoStore = useServerInfoStore()

    const user = ref<ServerInfoType | null>(null)

    const emit = defineEmits(['select-game'])

    const totalBalance = ref(user.value?.balance ?? 0)

    const startGame = ( id:number ) => {
        emit('select-game',id)
    }

    onBeforeMount(()=>{
      user.value = serverInfoStore.serverInfo
      console.log("Load ",user.value)
      locale.value = user.value?.lang ? user.value.lang : 'en'
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
    width: 90%;
    user-select: none;
}

.info {
    width: 40%;
    font-size: 1.5em;
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
    width: 90%;
    height: 15vh;
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
</style>


