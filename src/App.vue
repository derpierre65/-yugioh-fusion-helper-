<template>
  <router-view v-if="migrated" />
</template>

<script setup lang="ts">
import {useQuasar} from 'quasar';
import {ref} from 'vue';
import useDeckStore from 'stores/deck';
import useSavegameStore from 'stores/savegame';
import usePlayModeStore from 'stores/playMode';

//#region Composable & Prepare
const deckStore = useDeckStore();
const savegameStore = useSavegameStore();
const playModeStore = usePlayModeStore();
const q = useQuasar();
//#endregion

//#region Data
const migrated = ref(false);
//#endregion

//#region Computed
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
//#endregion

//#region Created
q.dark.set(true);

if (!playModeStore.migrated) {
  console.log('Migrate playModeStore to savegameStore')
  savegameStore.$patch({
    currentDuel: {
      drawnCards: playModeStore.drawn,
      fieldCards: playModeStore.fieldCards,
      handCards: playModeStore.cards,
    },
  });
  playModeStore.$patch({migrated: true});
  console.log('Migrated playModeStore');
}

if (!deckStore.migrated) {
  console.log('Migrate deckStore to savegameStore')
  savegameStore.$patch({
    wishlist: deckStore.wishlist,
    deckFusions: deckStore.fusions,
    deckCards: deckStore.cards,
  });
  deckStore.$patch({migrated: true});
  console.log('Migrated deckStore');
}

migrated.value = true;
//#endregion
</script>
