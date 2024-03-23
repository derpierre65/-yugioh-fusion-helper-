<template>
  <div v-if="cardDetails">
    <div :style="imageStyle" />
    <div class="text-center">
      {{id}}<br>
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
import {computed, onMounted} from 'vue';

//#region Composable & Prepare
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
    default: 0,
  },
});

const cardStore = useCardStore();
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
//#endregion

//#region Created
//#endregion
</script>