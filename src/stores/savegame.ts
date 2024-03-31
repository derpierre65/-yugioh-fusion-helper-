import {defineStore} from 'pinia';
import {Notify, useQuasar} from 'quasar';
import useCardStore from 'stores/card';

const useSavegameStore = defineStore('savegame', {
    persist: true,
    state() {
        return {
            stars: 0,
            passwordsUsed: [] as string[],
            // wishlist
            wishlist: {} as Record<string, number>,
            // fusion done with the own deck
            deckFusions: {} as Record<string, number>,
            // current deck
            deckCards: [] as string[],
            // current unused
            currentDuel: {
                handCards: [] as string[],
                fieldCards: [] as string[],
                drawnCards: [] as string[],
            },
        };
    },
    actions: {
        usePassword(password: string) {
            if (!this.passwordsUsed.includes(password)) {
                this.passwordsUsed.push(password);
            }
        },
        addFusion(id: string) {
            if (!this.deckFusions[id]) {
                this.deckFusions[id] = 0;
            }

            this.deckFusions[id] ++;
        },
        addToWishlist(id: string) {
            if (!this.wishlist[id]) {
                this.wishlist[id] = 0;
            }

            this.wishlist[id]++;

            const name = useCardStore().cards[id].name;

            Notify.create({
                color: 'green',
                message: `Added ${name} to wishlist`,
                position: 'top-right',
            });
        },
        removeFromWishlist(id: string) {
            if (!this.wishlist[id]) {
                delete this.wishlist[id];
                return;
            }

            this.wishlist[id]--;
            if ( this.wishlist[id] === 0 ) {
                delete this.wishlist[id];
            }
        },
    }
});

export default useSavegameStore;