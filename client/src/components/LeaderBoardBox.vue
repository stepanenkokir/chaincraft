<template>
    <div class="leaderboard-container">
        <div class="header">
            <h2>
                {{ props.board.caption }} 
                <button @click="toggleContent" class="toggle-button">
                    <font-awesome-icon :icon="isContentVisible ? 'minus' : 'plus'" />
                </button>
            </h2>
        </div>
        <div v-if="isContentVisible">
            <div v-for="player of props.board.listInfo" 
                :key="player.id"
                class="leaderboard-item">
                <div class="rank">{{ player.id }}</div>
                <div class="details">
                    <span class="name">{{ player.name }}</span>
                    <span class="score">{{ player.score }} points</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { useI18n } from 'vue-i18n'
    import { ref } from 'vue'
    import type { LeaderBoardType} from '../types/LeaderBoardType'

    const props = defineProps({
        board:{
            type: Object as () => LeaderBoardType,
            required: true
        }
    })

    const isContentVisible = ref(true);

    const toggleContent = () => {
        isContentVisible.value = !isContentVisible.value;
    }

</script>


<style scoped>
.leaderboard-container {
    position: relative;
    padding: 20px;
    width: 100%;
    max-width: 500px;
    margin: auto;
    
    border-radius: 8px;
    background-color: #f7f7f7;
    margin-bottom: 10px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

h2 {
    text-align: center;
    flex-grow: 1;
}

.toggle-button {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.toggle-button:focus {
  outline: none;
}

.leaderboard-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rank {
    font-size: 1.2em;
    font-weight: bold;
    color: #4caf50;
}

.details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
    padding-left: 10px;
}

.name {
    font-weight: bold;
    font-size: 1.1em;
    margin-right: 10px;
}

.score {
    color: #757575;
    margin-left: 20px;
}

.icon {
    background: none;
    border: none;
    padding: 0;
}

.separator {
    text-align: center;
    font-size: 1.5em;
    color: #757575;
    margin: 20px 0;
}
</style>
