import {defineStore} from 'pinia';

/** @deprecated merged to savegame store **/
const usePlayModeStore = defineStore('playMode', {
    persist: true,
    state() {
        return {
            migrated: false,
            started: false,
            fieldCards: [] as string[],
            cards: [] as string[],
            drawn: [] as string[],
        };
    },
});

export default usePlayModeStore;