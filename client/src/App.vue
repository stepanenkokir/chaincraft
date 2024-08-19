<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Head from './components/Head.vue'
</script>

<template>
    <div class="page-container">
        <header>            
            <Head name="Kirill" lang="en"/>            
        </header>
        
        <main class="content">
            <RouterView />
        </main> 
    
        <footer>
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
        </footer>
    </div>
</template>

<style>
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    background: linear-gradient(to bottom, #80d3ff, #bddbff);
}

.page-container {
    display: flex;
    flex-direction: column;
    height: 100vh; /* Увеличиваем до 100vh, чтобы footer был привязан к низу страницы */
    box-sizing: border-box;
}

header {
    place-items: center;
}

main.content {
    flex: 1; /* Это позволяет main занять все оставшееся пространство */
    overflow-y: auto; /* Добавляем скроллинг, если контента много */
    box-sizing: border-box;
}

footer {
    text-align: center;
    font-size: 1rem;
    flex-shrink: 0;
    margin: 10px;
}

nav {
    text-align: center;
    font-size: 1rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 0.5rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}


</style>
