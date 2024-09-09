<template>
    <div class="modal-overlay">
        <div class="pyro">
            <div class="before"></div>
            <div class="after"></div>
        </div>
        <div class="modal">
            <h2>{{ t('WIN') }}</h2>
            <hr/>
            <h3>
                {{ t('your_clicks') }}: 
                <span :class="[
                    'countResult',
                    props.resultInfo.count>=50 ? 'red' : ''
                ]">
                    {{ props.resultInfo.count }}
                </span>
                
            </h3>
            <h3>
                {{ t('your_time') }}:
                <span 
                :class="[
                    'timeResult',
                    props.resultInfo.time>=300000 ? 'red' : ''
                ]">
                    {{ props.resultInfo.time / 1000 }}
                </span>
                {{ t('sec') }}.
            </h3>
            <h3>
                {{ t('total_score') }}: 
                <span class="scoreResult">{{ props.resultInfo.score }}</span>
            </h3>                    
            <button class="start-button papirus-cursive" @click="finishGame">OK</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { ResultInfo } from '@/types/FoxHunterInterface'
    import { useI18n } from 'vue-i18n'    
    import { useServerInfoStore } from '../stores/serverInfoStore'  
    import { onBeforeMount } from 'vue'
   
    const { t, locale } = useI18n()
    const serverInfoStore = useServerInfoStore()

    const props = defineProps({
        resultInfo:{
            type        : Object as () => ResultInfo,
            required    : true
        }
    })

    const emit = defineEmits(['finish-game'])

    const finishGame = () => {
        emit('finish-game')
    }

    onBeforeMount(()=>{
        locale.value = serverInfoStore.locale      
    })
   
</script>

<style scoped>
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
    position: fixed;
    padding: 10px;
    margin-top: 20%;
    border-radius: 10px;
    text-align: center;
    will-change: transform;
    animation: grow 0.1s ease-in-out;
}

.countResult, .timeResult, .scoreResult {
    font-weight: 800;
    font-size: 1em;    
}

.red {
    color: red;
}
.red::after{
    content: "(Too much)";
    font-weight: 800;
}
</style>