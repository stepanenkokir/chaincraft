<template>
    <main>
        <BackButton @click="closeBtn"/>
        
        <AppStock101 v-if="props.game===1" />
        <AppFoxHunter v-if="props.game===2" />

    </main>
</template>

<script setup lang="ts" >``
    interface Props {
        game: number;        
    }    
    import { BackButton } from 'vue-tg'
    import AppFoxHunter from './AppFoxHunter.vue'
    import AppStock101 from './AppStock101.vue'
    
    
    const emit = defineEmits(['start-game'])
    const props = defineProps<Props>()


    
    const gameName = (id:number) =>{
        let currGameName='Stock101'
        switch (id) {
            case 1:
                currGameName='Stock101'
                break;
            case 2:
                currGameName='FoxHunter'
                break;
            case 3:
                currGameName='Tic Tac Toe'
                break;                
            default:
                currGameName='Stock101'
                break;
        }
        return currGameName
    } 
  
    const currentGame = gameName(props.game)

    const closeBtn = () => { 
        emit('start-game')
    }
</script>

<style>

</style> 