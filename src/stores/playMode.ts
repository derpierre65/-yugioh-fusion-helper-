import {defineStore} from 'pinia';

const usePlayModeStore = defineStore('playMode', {
    persist: true,
    state() {
        return {
            started: false,
            fieldCards: [] as string[],
            cards: [] as string[],
            drawn: [] as string[],
        };
    },
});

export default usePlayModeStore;