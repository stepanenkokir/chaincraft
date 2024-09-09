<template>
    <div class="modal-overlay">
        <div v-if="showWhenWin" class="pyro">
            <div class="before"></div>
            <div class="after"></div>
        </div>
        <div :class="[
            'modal',
            showWhenWin ? '' : 'error-bg'
        ]">            
            <span class="titleResult">{{ t(props.resultInfo.title) }}</span>            
            <hr/>
            <div>
                <span class="titleResult">
                    {{ t('total_score') }}:<b>{{  props.resultInfo.score }}</b>
                </span>
            </div>
            <div>
                <span class="titleResult">
                    {{ t('total_heap') }}:<b>{{  props.resultInfo.heap }} </b>
                </span>
            </div>
            <div v-if="showWhenWin">
                <button 
                    class="start-button papirus-cursive"
                    @click="continueGame">
                    {{ t('continue') }}
                </button>
            </div>
            <div v-else>

                <div v-if="props.resultInfo.overkill">
                    <div>                        
                        {{ t('Over limit') }}:<b>{{  props.resultInfo.goal }} </b>
                    </div>
                </div>
                <div v-else>
                    {{ t('No moves left') }}!
                </div>

                <button 
                    class="start-button papirus-cursive"
                    @click="startGame">
                    {{ t('restart') }}
                </button>
                <button 
                    class="back-button start-button papirus-cursive"                   
                    @click="rollback"
                >
                    {{ t('rollback') }}
                </button>                
            </div>           
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { ResultInfoStock } from '@/types/Stock101Interface'
    import { useI18n } from 'vue-i18n'    
    import { useServerInfoStore } from '../stores/serverInfoStore'  
    import { onBeforeMount, ref } from 'vue'
   
    const { t, locale } = useI18n()
    const serverInfoStore = useServerInfoStore()

    const showWhenWin = ref(false)

    const props = defineProps({
        resultInfo:{
            type        : Object as () => ResultInfoStock,
            required    : true
        }
    })

    const emit = defineEmits(['restart-game', 'rollback', 'continue-game'])

    const startGame = () => {
        emit('restart-game')
    }

    const rollback = () => {
        emit('rollback')
    }

    const continueGame = () => {
        emit('continue-game')
    }

    onBeforeMount(()=>{
        console.log("props = ", props.resultInfo)
        locale.value = serverInfoStore.locale
        showWhenWin.value = props.resultInfo.title === 'WIN' ? true : false    
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
    /* justify-content: center; */
    z-index: 1000;
}

.modal {
    background: rgb(204, 204, 204);
    width: 90vw; 
    position: fixed;
    padding: 10px;
    /* margin-top: 20%; */
    margin: 20% 5%;
    border-radius: 10px;
    text-align: center;
    will-change: transform;
    animation: grow 0.3s ease-in-out;   
}

@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.error-bg {
    background-color:rgba(250, 61, 61, 0.9)    
}


.titleResult, .heapResult, .scoreResult {
    font-weight: 800;
    font-size: 1.5em;    
}

.red {
    color: red;
}
.red::after{
    content: "(Too much)";
    font-weight: 800;
}
</style>