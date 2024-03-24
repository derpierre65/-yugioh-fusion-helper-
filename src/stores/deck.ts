import {defineStore} from 'pinia';
import {Notify, useQuasar} from 'quasar';
import useCardStore from 'stores/card';

const useDeckStore = defineStore('deck', {
    persist: true,
    state() {
        return {
            wishlist: {} as Record<string, number>,
            fusions: {} as Record<string, number>,
            cards: [],
        };
    },
    actions: {
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
        addFusion(id: string) {
            if (!this.fusions[id]) {
                this.fusions[id] = 0;
            }

            this.fusions[id] ++;
        },
        removeFromWishlisth(id: string) {
            if (!this.wishlist[id]) {
                delete this.wishlist[id];
                return;
            }

            this.wishlist[id]--;
            if ( this.wishlist[id] === 0 ) {
                delete this.wishlist[id];
            }
        }
    }
});

export default useDeckStore;