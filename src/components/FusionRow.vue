<template>
  <q-card>
    <q-card-section>
      <div class="flex items-center q-col-gutter-sm">
        <slot />
        <template v-for="(card, index) in fusion.merge">
          <span v-if="index !== 0" class="text-h4">+</span>
          <PlayCard :id="card" />
        </template>
        <span class="text-h4">=</span>
        <PlayCard :id="fusion.final"></PlayCard>
      </div>

    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import PlayCard from 'components/PlayCard.vue';

//#region Composable & Prepare
defineProps({
  fusion: {
    type: Object,
    required: true,
  },
});
//#endregion

//#region Data
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
//#endregion
</script>