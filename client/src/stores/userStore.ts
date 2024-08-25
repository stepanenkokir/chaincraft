import { defineStore } from 'pinia'
import type { UserType } from '../types/UserType'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: {} as UserType | null, // начальное состояние
    }),
    actions: {
        setUser(user: UserType) {
            this.user = user;
        },
        clearUser() {
            this.user = null;
        },
    },
});
