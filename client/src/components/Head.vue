<template>
    <div class="greetings">
        <img src="@/assets/CCLogo.png" alt="Logo" class="logo" />
        <h1 class="great green"> {{ greetings }} </h1> 
    </div>
</template>

<script setup lang="ts">
    import { useI18n } from 'vue-i18n'
    import type {ServerInfoType} from '@/types/ServerInfoType'

    const props = defineProps({
        serverInfo: {
            type:  Object as () => ServerInfoType | null,
            required: true,
        },
    })
    const { t, locale } = useI18n()
    locale.value = props.serverInfo ? props.serverInfo.lang : 'en'

    const greetings = props.serverInfo ? `${t('welcomeMessage')}, ${props.serverInfo.user_name}` :  `${t('welcomeMessage')}, ${t('unknownName')}`
</script>

<style scoped>

.greetings {
    width: 90vw;
    white-space: nowrap;
    text-align: center;
    overflow-x: auto; /* Добавляет горизонтальный скролл */
    font-weight: bold;
    display: flex;
    align-items: center; /* Vertically center the image and text */
}

.logo {
    width: 100px; /* Adjust the size as needed */
    height: 100px; /* Maintain aspect ratio */
    margin-right: 40px; /* Space between image and text */
}

.great {
    display: inline-block;
    font-size: 6vw; /* Динамическое изменение размера шрифта */
    overflow: hidden;
    text-overflow: ellipsis; /* Добавляет троеточие, если текст выходит за пределы блока */
    white-space: nowrap; /* Предотвращает перенос текста */
    font-weight: 800;
}

</style>
