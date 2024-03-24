<template>
  <div v-if="cardDetails">
    <div :style="imageStyle" />
    <div class="text-center" style="max-width:140px;">
      {{id}}<br>
      <template v-if="$route.name !== 'play'">
        <a href="#" @click.prevent="deckStore.addToWishlist(id)">Add to Wishlist</a><br>
        <a href="#" @click.prevent="cardStore.showFusion(id)">Show Fusions</a><br>
        {{ cardStore.cards[id].password }} = {{ cardStore.cards[id].cost }}<br>
        <slot name="before-name" />
        <a :href="getLink(id)" target="_blank">{{ cardStore.cards[id].name }}</a><br>
      </template>
      <slot />
    </div>
  </div>
  <div v-else>
    <span>unknown card</span>
    {{id}}
  </div>
</template>

<script setup lang="ts">
import useCardStore from 'stores/card';
import {computed} from 'vue';
import useDeckStore from 'stores/deck';

//#region Composable & Prepare
const props = defineProps({
  isPlay: Boolean,
  id: {
    type: [String, Number],
    required: true,
    default: 0,
  },
});

const cardStore = useCardStore();
const deckStore = useDeckStore();
//#endregion

//#region Data
//#endregion

//#region Computed
const cardDetails = computed(() => {
  return cardStore.cards[props.id] || null;
});

const imageStyle = computed(() => {
  return {
    width: '140px',
    height:'212px',
    background: `url("${cardDetails.value.image}") -2px 0 no-repeat`,
    backgroundSize: `320px 256px`,
  };
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function getLink(id: string) {
  const card = cardStore.cards[id];
  const urlPathName = card.name.replace(/#/g, "");

  return `https://yugipedia.com/wiki/${urlPathName} (FMR)`;
}
//#endregion

//#region Created
//#endregion
</script>