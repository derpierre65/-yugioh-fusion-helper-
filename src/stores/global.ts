import {defineStore} from 'pinia';

const useGlobalStore = defineStore('global', {
    persist: true,
    state() {
        return {
            updateAvailable: false,
        };
    },
});

export default useGlobalStore;