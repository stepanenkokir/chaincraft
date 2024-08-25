<template>
    <div class="qr" >
        <h1>This is a Telegram App only</h1>
        <h2>Scan the QR code to start it on Telegram :o)</h2>
        <QrcodeVue
            value="https://t.me/Stock101SteKirBot?startapp"
            :size="300"
            :level="'Q'"
            :bgColor="'#ffffff'"
            :fgColor="'#FF0000'"
        />
    </div>
</template>
<script setup lang="ts">
    import QrcodeVue from 'qrcode.vue'
</script>
<style scoped>
.qr {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* Full viewport height */
    text-align: center; /* Center the text */
}

.qr h1, .qr h2 {
    margin: 10px 0;
}

</style>