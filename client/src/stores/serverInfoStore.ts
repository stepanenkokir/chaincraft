import { defineStore } from 'pinia'
import type { ServerInfoType } from '../types/ServerInfoType'

export const useServerInfoStore = defineStore('serverInfo', {
    state: () => ({
        serverInfo: {} as ServerInfoType | null,
    }),
    actions: {
        setUser(user: ServerInfoType | null) {
            this.serverInfo = user
        },
        clearUser() {
            this.serverInfo = null
        },
    },
});
