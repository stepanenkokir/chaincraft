<template>
  <div class="welcome-container">
    <h1 class="title"> {{ t('welcomeGame') }} </h1>
    <p class="intro-text"> {{ t('welcomeMessage') }}, {{ user ? user.user_name :  t('unknownName') }}! </p>
    <p class="intro-text">{{ t('getReadyMsg_1') }}</p>
    <p class="details-text">{{ t('getReadyMsg_2') }}</p>
    <p class="rules-text">{{ t('getReadyMsg_3') }}</p>
    <p>
      <a href="https://t.me/Stock101SteKirBot?start=rules" target="_blank" class="rules-link">{{ t('clickHere') }}</a>{{ t('getReadyMsg_4') }}
    </p>
    <MainButton text="Start" @click="startGame" class="start-button-fp" />
  </div>
</template>
  
<script setup lang="ts">
    import { MainButton } from 'vue-tg'
    import type {ServerInfoType} from '@/types/ServerInfoType'
    import { useServerInfoStore } from '../stores/serverInfoStore'
    import { onBeforeMount, ref } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t, locale } = useI18n()

    const serverInfoStore = useServerInfoStore()

    const user = ref<ServerInfoType | null>(null)
  
    const emit = defineEmits(['start-game'])

    const startGame = () => {
        emit('start-game')
    }

    onBeforeMount(()=>{
      user.value = serverInfoStore.serverInfo
      locale.value = user.value?.lang ? user.value.lang : 'en'
    })

</script>
  
<style scoped>
.welcome-container {
  max-width: 600px;
  margin: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.welcome-container:hover {
  transform: scale(1.02);
  background-color: #e0f7fa;
}

.title {
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 2.5em;
  color: #00796b;
  margin-bottom: 20px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
}

.intro-text,
.details-text,
.rules-text {
  font-family: 'Arial', sans-serif;
  font-size: 1.2em;
  color: #444;
  margin-bottom: 15px;
  line-height: 1.6;
}

.rules-link {
  font-family: 'Arial', sans-serif;
  font-size: 1.2em;
  color: #0288d1;
  text-decoration: none;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.rules-link:hover {
  color: #01579b;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
}

.start-button-fp {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1.5em;
  background-color: #00796b;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.start-button-fp:hover {
  background-color: #004d40;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>