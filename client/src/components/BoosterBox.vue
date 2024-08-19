<template>
    <div class="boosters-container">
        <h2>Boosters for {{ props.data.dest }}</h2>
        <div v-for="el in props.data.arrayInfo" 
            :key="el.name+props.data.dest"
            class="booster">
            <button class="icon">
                <font-awesome-icon :icon="iconMap(el.name)"/>
            </button>
            <div class="text">
                <span class="title"> {{el.name}} </span>
                <span class="availability">{{el.available}} available</span>
            </div>
            <button class="icon">
                <font-awesome-icon :icon="['fas', 'video']" title="Video" :style="{ color: 'red' }"/>
            </button>
        </div>
    </div>  
</template>

<script setup lang="ts">
    import { useI18n } from 'vue-i18n'
    import type {BoosterBoxType} from '@/types/BoosterBoxType'

    const props = defineProps({
        data:{
            type:Object as () => BoosterBoxType,
            required: true
        }
    })

    const iconsArr: { [key: string]: string[] } = {
        'Move back': ['fas', 'rotate-left'],
        'Change color': ['fas', 'brush'],
        'Autoshow X': ['fas', 'eye'],
    }

    const iconMap = (el: string) => {
        return iconsArr[el] || ['fas', 'rotate-left'];
    }
</script>

<style scoped>
.boosters-container {
    width: 100%;
    background-color: #f7f5f1;
    padding: 20px;
    border-radius: 10px;
    font-family: Arial, sans-serif;
    margin-bottom: 10px;
}

h2 {
    margin: 0 0 20px;
    font-size: 24px;
}

.booster {
    display: flex;
    align-items: center;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    justify-content: space-between;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.booster .icon {
    background-color: #f9c923;
    padding: 10px;
    border-radius: 50%;
    margin-right: 15px;
}

.booster .icon img {
    width: 10px;
    height: 150px;
}

.booster .text {
    display: flex;
    flex-direction: column;
}

.booster .title {
    font-size: 16px;
    font-weight: bold;
}

.booster .availability {
    font-size: 14px;
    color: gray;
}

.get-booster {
    width: 100%;
    background-color: #f9c923;
    color: white;
    padding: 15px;
    font-size: 16px;
    border: none;
    border-radius: 10px;
    margin-top: 20px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.get-booster img {
    margin-left: 10px;
    width: 20px;
    height: 20px;
}


</style>