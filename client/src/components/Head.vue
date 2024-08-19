<template>
    <div class="greetings">
        <h1 class="green"> {{ greetings }}, {{ props.name }} </h1> 
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
h1 {
    font-weight: 800;
    font-size: 2rem;
    position: relative;
    top: -10px;
}

.greetings{
    text-align: center;
}

</style>
