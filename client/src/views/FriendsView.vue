<template>
    <FriendsListBox :list="friendsList" />
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import FriendsListBox from '@/components/FriendsListBox.vue'
    import type { FriendsListType } from '@/types/FriendsListType'

    const friendsList:FriendsListType[] = [  
        {
            id: 1,
            rating: 122,
            name: 'Tom Cruze',
            score: 1200,
            status: "rest"
        },
        {
            id: 22,
            rating: 172,
            name: 'Harry Potter',
            score: 100,
            status: "battle"
        },
        {
            id: 77,
            rating: 1072,
            name: 'Vasya Pupkin',
            score: 1,
            status: "online"
        },
       
    ]
</script>
