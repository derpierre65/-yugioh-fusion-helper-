import {defineStore} from 'pinia';
import cards from 'assets/cards.json';

type YugiohCard = {
    name: string;
    image: string;
    atk: number | null;
    def: number | null;
    stars: number | null;
    password: string | null;
    cost: number | null;
};

const useCardStore = defineStore('card', {
    state() {
        return {
            cards: cards as Record<string, YugiohCard>,
        };
    },
});

export {
    useCardStore as default,
    type YugiohCard,
};