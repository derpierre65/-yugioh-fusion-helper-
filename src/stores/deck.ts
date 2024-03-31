import {defineStore} from 'pinia';

/** @deprecated merged to savegame store **/
const useDeckStore = defineStore('deck', {
    persist: true,
    state() {
        return {
            migrated: false,
            wishlist: {} as Record<string, number>,
            fusions: {} as Record<string, number>,
            cards: [],
        };
    },
});

export default useDeckStore;