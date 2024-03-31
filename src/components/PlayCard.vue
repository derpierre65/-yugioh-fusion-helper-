<template>
  <div v-if="cardDetails">
    <div :style="imageStyle" />
  <div v-if="cardDetails" @mouseenter="showButtons = true" @mouseleave="showButtons = false">
    <div :style="imageStyle" class="relative-position">
      <div v-if="showButtons" class="tw-absolute tw-top-2 tw-right-2 q-gutter-x-sm tw-h-[24px] tw-z-10">
        <q-btn icon="fas fa-clipboard-list" color="primary" size="sm" dense @click="savegameStore.addToWishlist(id)">
          <q-tooltip>Add to Wishlist</q-tooltip>
        </q-btn>
        <q-btn icon="fas fa-atom" color="primary" size="sm" dense @click="cardStore.showFusion(id)">
          <q-tooltip>Show Fusions</q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="text-center" style="max-width:140px;">
      {{id}}<br>
      <template v-if="$route.name !== 'play'">
        <template v-if="cardDetails.password && cardDetails.cost">
          {{ cardDetails.password }} = {{ cardDetails.cost }}<br>
        </template>
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
import {computed, ref} from 'vue';
import useSavegameStore from 'stores/savegame';

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
const savegameStore = useSavegameStore();
//#endregion

//#region Data
const showButtons = ref(false);
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