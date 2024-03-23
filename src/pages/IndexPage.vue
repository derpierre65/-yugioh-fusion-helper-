<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-md">
      <div class="col-grow">
        <q-input
            v-model="cards"
            label="Your current Cards"
            hint="Split multiple Card ids with , or space. example: 604,102,123,101,586"
            @update:model-value="fusionScanned = false"
            @keyup.enter="submit"
        />
      </div>
      <div class="flex items-center">
        <q-btn label="Find Fusions" color="primary" @click="submit"/>
      </div>
    </div>

    <template v-if="fusions.length">
      <div class="text-h6 q-py-md">{{fusions.length}} Fusions found:</div>
      <FusionRow v-for="fusion in fusions" :fusion="fusion" />
    </template>
    <div v-else-if="fusionScanned" class="q-pt-lg">
      No Fusions available :(
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {findFusions, formatFusionList, getIdsByString} from 'src/lib/fusions';
import useCardStore from 'stores/card';
import FusionRow from 'components/FusionRow.vue';

//#region Composable & Prepare
const cardStore = useCardStore();
//#endregion

//#region Data
const cards = ref('');
const fusions = ref([]);
const fusionScanned = ref(false);
//#endregion

//#region Computed
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function submit() {
  const ids = getIdsByString((cards.value));

  const foundFusions = findFusions(1, ids, [], 0);
  fusions.value = formatFusionList(foundFusions);
  fusionScanned.value = true;
}

//#endregion

//#region Created
//#endregion
</script>
