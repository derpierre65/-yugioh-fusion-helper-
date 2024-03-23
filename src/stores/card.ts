import {defineStore} from 'pinia';
import cards from 'assets/cards.json';

const useCardStore = defineStore('card', {
    state() {
        return {
            cards,
        };
    },
});

export default useCardStore;