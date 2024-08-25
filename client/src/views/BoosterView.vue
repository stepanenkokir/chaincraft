<template>
    <main>
        <BoosterBox 
            v-for="box in boosterInfo"
            :key="box.dest"
            :data="box"
        />
    </main>    
</template>

<script setup lang="ts">
    import BoosterBox from '@/components/BoosterBox.vue'
    import type { BoosterBoxType } from '@/types/BoosterBoxType'

    const boosterInfo:BoosterBoxType[] = [
        {
            dest: "Stock101", 
            arrayInfo: [
                {
                    name: "Move back", 
                    available: 2
                },
                { 
                    name: "Change color", 
                    available: 3
                },
            ]
        },
        {
            dest: "FoxHunter", 
            arrayInfo:[
                {
                    name: "Autoshow X", 
                    available: 2
                },
            ]
        },
        {
            dest: "TicTacToe", 
            arrayInfo:[
                {
                    name: "Move back", 
                    available: 4 
                },
            ]
        },
    ]
</script>


