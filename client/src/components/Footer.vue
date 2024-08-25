<template>
    <nav>
        <RouterLink to="/">
            <font-awesome-icon :icon="['fas', 'home']" class="fa-3x" title="Home" />
        </RouterLink>
        <RouterLink to="/friends">
            <font-awesome-icon :icon="['fas', 'user-friends']" class="fa-3x" title="Friends" />
        </RouterLink>
        <RouterLink to="/booster">
            <font-awesome-icon :icon="['fas', 'rocket']" class="fa-3x" title="Booster"/>
        </RouterLink>
        <RouterLink to="/leaderboard">
            <font-awesome-icon :icon="['fas', 'trophy']" class="fa-3x" title="LeaderBoard"/>
        </RouterLink>
        <RouterLink to="/settings">
            <font-awesome-icon :icon="['fas', 'cog']" class="fa-3x" title="Settings"/>
        </RouterLink>
    </nav>
</template>

<script setup lang="ts">


</script>

<style scoped>


</style>
