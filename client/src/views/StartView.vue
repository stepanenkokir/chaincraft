<template>
    <div>
       <h1>KEKEKE {{ user }}</h1>
    </div>
</template>
  
<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import { useWebApp } from 'vue-tg'
 
    const router = useRouter()
    const { initDataUnsafe } = useWebApp()
    const user = initDataUnsafe.user

    if (user){
        //check using
        router.push('/tutorial')       
    }else{
        console.log("NO TELEGRAM")
        router.push('/qrcode')
    }

</script>
<style scoped>

</style>


