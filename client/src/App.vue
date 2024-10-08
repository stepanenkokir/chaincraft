<template>
    <div>
        <div v-if="tutorialPage">           
            <main class="content">
                <FirstPageView @start-game="handleStartGame" />
            </main> 
        </div>
        <div v-if="gameScreen>0">           
            <main class="content">
                <MainGameScreen @start-game="handleStartGame" :game="gameScreen" />
            </main> 
        </div>
        <div  v-touch:swipe.left="onSwipeLeft" v-touch:swipe.right="onSwipeRight"  class="page-container" v-if="readyToShow">
            <header>
                <Head :serverInfo="serverInfo" />
            </header>
            
            <main class="content">
                <transition name="page">
                    <RouterView @select-game="selectGame"/>
                </transition>
            </main> 
        
            <footer>
                <Footer />
            </footer>
        </div>
        <div v-if="isLoading" class="loader-container">
            <div class="loader"/>
        </div>
        <QrCode v-if="showQR" />            
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted  } from 'vue'
    import { RouterView,  useRouter, useRoute } from 'vue-router'  
    import Head from './components/Head.vue'
    import type { ServerInfoType, responseServerInfoType } from '@/types/ServerInfoType'
    import FirstPageView from './views/FirstPageView.vue'
    import QrCode from './components/QrCodeBox.vue'
    import MainGameScreen from './views/MainGameScreen.vue'
    import Footer from './components/Footer.vue'
    import { checkUser } from './services/socketIOHandle'
    import { useServerInfoStore } from './stores/serverInfoStore'
 

    const tutorialPage = ref(false)
    const readyToShow = ref(false)
    const gameScreen = ref(0)
    const isLoading = ref(false)
    const showQR = ref(false)

    const serverInfoStore = useServerInfoStore()
    const serverInfo = ref<ServerInfoType|null>(null)
   
    /** Routing */
    const router = useRouter()
    const route = useRoute()
    const routes = ['/', '/friends', '/booster', '/leaderboard', '/settings']

    const onSwipeLeft = () => {
        router.push({ path: nextRoute() })
    }
    const nextRoute = () => {
        const currentIndex = routes.indexOf(route.path)
        return routes[(currentIndex + 1) % routes.length]
    }
    
    const onSwipeRight = () => {
        router.push({ path: prevRoute() })
    }
    const prevRoute = () => {
        const currentIndex = routes.indexOf(route.path)
        return routes[(currentIndex - 1 + routes.length) % routes.length]
    }

    /** Start Game Logic */
    const handleStartGame = () => {
        tutorialPage.value = false
        readyToShow.value = true  
        gameScreen.value = 0  
    }

    const startGame = ( ) =>{
        if (!serverInfo.value?.first_time){
            handleStartGame()
        } else {          
            tutorialPage.value = true
            readyToShow.value = false 
            gameScreen.value = 0 
        }
    }

    const selectGame = (game: number = 0) =>{        
        tutorialPage.value = false
        readyToShow.value = false 
        gameScreen.value = game  
    }

    /** Init Game Logic */
    onMounted(async()=>{
        isLoading.value = true 
        try {
            const loadUserInfo:responseServerInfoType = await checkUser( )
            if (loadUserInfo.success){
                serverInfo.value = loadUserInfo.data
                serverInfoStore.setUser( serverInfo.value )                

                showQR.value = false
                startGame()                
            } else {
                console.log("No telegram")
                showQR.value = true
            }
            
        } catch (error) {
            console.log("Error when start App ",error)
            showQR.value = true
        }finally{
            isLoading.value = false         
        }
    })
</script>

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

.page-container {
    position: relative;
    overflow: hidden;
}

.page-container .content-enter-active, 
.page-container .content-leave-active {
    transition: transform 0.5s ease-in-out;
}

.page-container .content-enter, 
.page-container .content-leave-to {
    transform: translateX(100%);
}

.page-container .content-leave-active {
    transform: translateX(-100%);
}
</style>