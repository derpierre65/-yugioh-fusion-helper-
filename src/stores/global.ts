import {defineStore} from 'pinia';

const useGlobalStore = defineStore('global', {
    state() {
        return {
            updateAvailable: false,
        };
    },
});

export default useGlobalStore;