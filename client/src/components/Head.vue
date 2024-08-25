<template>
    <div class="greetings">
        <h1 class="great green"> {{ greetings }}, {{ props.name }} </h1> 
    </div>
</template>

<script setup lang="ts">
    import { useI18n } from 'vue-i18n'

    const props = defineProps({
        lang: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        info: {
            type: String,
            required: false,
        },
    })
    const { t, locale } = useI18n()
    locale.value =  props.lang || 'en'

    const greetings = props.info ? t('welcomeMessage') : t('welcomeBackMessage')
</script>

<style scoped>

.greetings {
    width: 90vw;
    white-space: nowrap;
    text-align: center;
    overflow-x: auto; /* Добавляет горизонтальный скролл */
    font-weight: bold;
}

.great {
    display: inline-block;
    font-size: 8vw; /* Динамическое изменение размера шрифта */
    overflow: hidden;
    text-overflow: ellipsis; /* Добавляет троеточие, если текст выходит за пределы блока */
    white-space: nowrap; /* Предотвращает перенос текста */
    font-weight: 800;
}

</style>
