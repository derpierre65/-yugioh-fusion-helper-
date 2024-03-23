import {defineStore} from 'pinia';

const usePlayModeStore = defineStore('playMode', {
    state() {
        return {
            started: false,
            fieldCards: [],
            cards: [],
        };
    },
});

export default usePlayModeStore;