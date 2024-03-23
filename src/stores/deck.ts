import {defineStore} from 'pinia';

const useDeckStore = defineStore('deck', {
    persist: true,
    state() {
        return {
            cards: [],
        };
    },
});

export default useDeckStore;