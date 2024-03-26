import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            fold: false,
            refresh: true,
        }
    },
    actions: {
        resetRefresh() {
            this.refresh = false
        },
    },
})

export default useLayoutSettingStore
