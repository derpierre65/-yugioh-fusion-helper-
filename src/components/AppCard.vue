<template>
  <q-card>
    <q-toolbar :class="{'cursor-pointer': expandable}" @click="toggleVisible">
      <q-toolbar-title class="text-h5">
        <slot name="title">{{ title }}</slot>
      </q-toolbar-title>
      <q-icon v-if="expandable" :name="visible ? 'expand_less' : 'expand_more'" size="md"></q-icon>
    </q-toolbar>

    <q-slide-transition>
      <q-card-section v-show="visible">
        <slot/>
      </q-card-section>
    </q-slide-transition>
  </q-card>
</template>

<script setup lang="ts">
import {ref} from 'vue';

//#region Composable & Prepare
const props = defineProps({
  title: String,
  show: Boolean,
  expandable: Boolean,
});
//#endregion

//#region Data
const visible = ref(props.show);
//#endregion

//#region Computed
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function toggleVisible() {
  if (!props.expandable) {
    return;
  }

  visible.value = !visible.value;
}

//#endregion

//#region Created
//#endregion
</script>