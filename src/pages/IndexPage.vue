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
      <q-card v-for="fusion in fusions">
        <q-card-section>
          <div class="flex items-center">
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
    <div v-else-if="fusionScanned" class="q-pt-lg">
      No Fusions available :(
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {findFusions, getIdsByString} from 'src/lib/fusions';
import useCardStore from 'stores/card';
import PlayCard from 'components/PlayCard.vue';

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
  const fusionList = [];

  for (const possibleFusion of foundFusions) {
    const cards = possibleFusion.split('=');
    fusionList.push({
      merge: cards[0].split('+').map(value => value.trim()),
      final: cards[1].trim(),
    });
  }

  fusions.value = fusionList.sort((a,b) => {
    const aCard = cardStore.cards[a.final];
    const bCard = cardStore.cards[b.final];
    return aCard.atk < bCard.atk ? 1 : -1;
  });

  fusionScanned.value = true;
}

//#endregion

//#region Created
//#endregion
</script>
