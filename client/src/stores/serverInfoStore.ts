import { defineStore } from 'pinia'
import type { ResultGameInfo, ServerInfoType } from '../types/ServerInfoType'

export const useServerInfoStore = defineStore('serverInfo', {
    state: () => ({
        serverInfo  : {} as ServerInfoType | null,
        locale      : 'en',
        gameResults : [
            { id: 1, result: 'Best result: 0' }, // Stock101 result
            { id: 2, result: 'Best result: 0' }, // FoxHunter result
            { id: 3, result: 'Best result: 0' }, // Tic Tac Toe result
        ] // You can initialize this based on your server data
    
    }),
    actions: {
        setUser(user: ServerInfoType | null) {
            this.serverInfo = user
            if (user?.lang) {
                this.setLocale(user.lang)
            }

            if (user?.result_info){
                this.setGameResult(user.result_info)
            }
        },
        clearUser() {
            this.serverInfo = null
        },
        setLocale(lang:string) {
            this.locale = lang
        },
        setGameResult( resultInfo: Array<ResultGameInfo>) {
            resultInfo.forEach(it => {
                const game = this.gameResults.find(g => g.id === it.id)
                if (game) {
                    game.result = it.result
                }
            })
        }
    },
})
