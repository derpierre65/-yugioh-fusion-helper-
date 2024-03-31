<template>
  <q-page class="q-pa-lg">
    <div class="text-h6 q-mb-md">Cards on Wishlist: {{total}} (Required Stars: {{totalPrice}})</div>
    <div class="flex">
      <PlayCard v-for="(count, id) in savegameStore.wishlist" :id="id">
        <template #action-buttons>
          <q-btn icon="fas fa-times" color="negative" size="sm" dense @click="savegameStore.removeFromWishlist(id)">
            <q-tooltip>Remove</q-tooltip>
          </q-btn>
        </template>
        <template #before-name>
          {{count}}x<br>
        </template>
      </PlayCard>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import PlayCard from 'components/PlayCard.vue';
import useCardStore from 'stores/card';
import {computed} from 'vue';
import useSavegameStore from 'stores/savegame';

//#region Composable & Prepare
const savegameStore = useSavegameStore();
const cardStore = useCardStore();
//#endregion

//#region Data
//#endregion

//#region Computed
const total = computed(() => {
  return Object.keys(savegameStore.wishlist).reduce((prev, key) => prev + savegameStore.wishlist[key], 0);
});
const totalPrice = computed(() => {
  return Object.keys(savegameStore.wishlist).reduce((prev, key) => prev + savegameStore.wishlist[key] * (cardStore.cards[key].cost || 0), 0);
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
//#endregion

//#region Created
//#endregion
</script>