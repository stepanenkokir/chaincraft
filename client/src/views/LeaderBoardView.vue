<template>
    <LeaderBoardBox v-for="board in boardsInfo" :key="board.caption" :board="board" />
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import LeaderBoardBox from '@/components/LeaderBoardBox.vue'
    import type { LeaderBoardType } from '@/types/LeaderBoardType'

    // const players = ref([
    //     { id: 1, name: 'Alice', score: 1200 },
    //     { id: 2, name: 'Bob', score: 1150 },
    //     { id: 3, name: 'Charlie', score: 1100 },
    //     { id: 57, name: 'Me', score: 55 },
    // ])

    const boardsInfo:LeaderBoardType[] = [
        {
            caption: "Main Leaderboard",
            listInfo: [   
                { id: 1, name: 'Alice', score: 1200 },
                { id: 2, name: 'Bob', score: 1150 },
                { id: 3, name: 'Charlie', score: 1100 },
                { id: 57, name: 'Me', score: 55 },
            ]
        },
        {
            caption: "FoxHunter Leaderboard",
            listInfo: [   
                { id: 1, name: 'Kirill', score: 1200 },
                { id: 2, name: 'Tatiana', score: 1150 },
                { id: 3, name: 'Tom Cruze', score: 1100 },
                { id: 57, name: 'Me', score: 55 },
            ]
        },
        {
            caption: "Stock101 Leaderboard",
            listInfo: [   
                { id: 1, name: 'Kirill', score: 1200 },
                { id: 2, name: 'Tatiana', score: 1150 },
                { id: 3, name: 'Tom Cruze', score: 1100 },
                { id: 57, name: 'Me', score: 55 },
            ]
        },
        {
            caption: "TicTacToe Leaderboard",
            listInfo: [   
                { id: 1, name: 'Kirill', score: 1200 },
                { id: 2, name: 'Tatiana', score: 1150 },
                { id: 3, name: 'Tom Cruze', score: 1100 },
                { id: 57, name: 'Me', score: 55 },
            ]
        }
    ]
</script>
