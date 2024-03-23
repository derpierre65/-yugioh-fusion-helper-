import {defineStore} from 'pinia';

const usePlayModeStore = defineStore('playMode', {
    persist: true,
    state() {
        return {
            started: false,
            fieldCards: [],
            cards: [],
            drawn: [],
        };
    },
});

export default usePlayModeStore;