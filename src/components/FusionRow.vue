<template>
  <q-card>
    <q-card-section>
      <div class="flex items-start q-col-gutter-sm">
        <slot />
        <template v-for="(card, index) in fusion.merge">
          <div v-if="index > 0" class="text-h4 self-center tw-mb-12">+</div>
          <PlayCard :id="card">
            <slot name="card" v-bind="{card}" />
          </PlayCard>
        </template>
        <span class="text-h4 self-center tw-mb-12">=</span>
        <PlayCard :id="fusion.final">
          <slot name="final-card" v-bind="{card: fusion.final}">
            <slot v-if="useCardAsFinal" name="card" v-bind="{card: fusion.final}" />
          </slot>
        </PlayCard>
      </div>

    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import PlayCard from 'components/PlayCard.vue';

//#region Composable & Prepare
defineProps({
  useCardAsFinal: Boolean,
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