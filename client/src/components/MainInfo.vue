<template>
    <div>
        <div class="button-container">
            <button class="vertical-button" @click="startStock101">Stock101</button>
            <button class="vertical-button">FoxHunter</button>
            <button class="vertical-button">Tic Tac Toe</button>
        </div>
    </div>
</template>
  
<script setup lang="ts">
    import { useRouter } from 'vue-router'
    const router = useRouter()

    const startStock101 = () => {
        router.push('/stock101')
    }
</script>
<style scoped>
.button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 80vh;
    justify-content: space-around;
}

.vertical-button {
    width: 90%;
    height: 20vh;
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


