<template>
    <div class="welcome-container">
      <h1>Welcome to the ChainCraft</h1>
      <p>
        Welcome, {{ props.user.first_name }}! Get ready to dive into the world of ChainCraft.
        Explore, build, and conquer. Ready to start your adventure?
      </p>
      <p>
        <a href="https://t.me/Stock101SteKirBot?start=rules" target="_blank">Click here</a> to read the detailed rules.
      </p>
      <MainButton text="Start" @click="startGame" />
    </div>
</template>
  
<script setup lang="ts">
    import { MainButton } from 'vue-tg'
    import type { UserType } from '../types/UserType'

    const props = defineProps({
        user:{
            type      : Object as () => UserType,
            required  : true
        }
    })
  
    const emit = defineEmits(['start-game'])
     
  
    const startGame = () => {
        emit('start-game')
    }

</script>
  
  <style scoped>
  .welcome-container {
    text-align: center;
    padding: 20px;
  }
  
  .welcome-container p {
    margin: 10px 0;
  }
  
  .welcome-container a {
    color: #007bff;
    text-decoration: none;
  }
  
  .welcome-container a:hover {
    text-decoration: underline;
  }
  </style>
  