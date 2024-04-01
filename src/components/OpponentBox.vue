<template>
  <div :style="imageStyle" class="relative-position">
    <q-tooltip>{{ personDetails.name }}</q-tooltip>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import persons from 'assets/persons.json';

//#region Composable & Prepare
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
//#endregion

//#region Data
//#endregion

//#region Computed
const personDetails = computed(() => {
  return persons.find((person) => person.order === props.id - 1);
});

const imageStyle = computed(() => {
  let top = -26;
  let left = -275;
  const row = Math.floor(props.id / 5);

  left -= 53 * (props.id % 5);
  top -= 53 * row;

  return {
    width: '48px',
    height: '48px',
    background: `url("/assets/images/opponents.png") no-repeat`,
    backgroundPosition: `${left}px ${top}px`,
    backgroundSize: `540px 451px`,
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