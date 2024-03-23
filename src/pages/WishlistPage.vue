<template>
  <q-page class="q-pa-lg">
    <div class="text-h6">Cards on Wishlist: {{total}} ({{totalPrice}})</div>
    <div class="flex">
      <PlayCard v-for="(count, id) in deckStore.wishlist" :id="id">
        {{count}}x<br>
        {{ cardStore.cards[id].password }} = {{ cardStore.cards[id].cost }}<br>
        <q-btn label="Remove" color="red" @click="deckStore.removeFromWishlisth(id)"/>
      </PlayCard>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import useDeckStore from 'stores/deck';
import PlayCard from 'components/PlayCard.vue';
import useCardStore from 'stores/card';
import {computed} from 'vue';

//#region Composable & Prepare
const deckStore = useDeckStore();
const cardStore = useCardStore();
//#endregion

//#region Data
//#endregion

//#region Computed
const total = computed(() => {
  return Object.keys(deckStore.wishlist).reduce((prev, key) => prev + deckStore.wishlist[key], 0);
});
const totalPrice = computed(() => {
  return Object.keys(deckStore.wishlist).reduce((prev, key) => prev + deckStore.wishlist[key] * (cardStore.cards[key].cost || 0), 0);
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