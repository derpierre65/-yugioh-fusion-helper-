<template>
  <q-page class="q-pa-lg">
    <div class="text-center">
      <q-btn label="Start new game" color="primary" @click="startNewGame"/>
    </div>

    <!--region add card container-->
    <div class="row q-col-gutter-md">
      <div class="col-grow">
        <q-input
            v-model="newCards"
            label="New Cards"
            hint="Add your new cards here. Split multiple Card ids with , or space. example: 604,102,123,101,586"
            @keyup.enter="addCards"
        />
      </div>
      <div class="flex items-center">
        <q-btn label="Add Cards" color="primary" @click="addCards"/>
      </div>
    </div>
    <!--endregion-->

    <div class="flex q-col-gutter-sm">
      <div style="min-width:700px;">
        <div style="position: sticky; top: 100px;">
          <template v-if="playStore.fieldCards.length">
            <div class="text-h6">Your field cards</div>
            <div class="row">
              <PlayCard v-for="id in playStore.fieldCards" :id="id">
                <q-btn label="Destroy" color="red"/>
              </PlayCard>
            </div>
          </template>
          <template v-if="playStore.cards.length">
            <div class="text-h6 q-py-sm">Your hand cards</div>
            <div class="row">
              <PlayCard v-for="id in playStore.cards" :id="id">
                <q-btn label="Play" color="primary" @click="playCard(id)"/>
              </PlayCard>
            </div>
          </template>
        </div>
      </div>
      <div v-if="playStore.cards.length" class="col-grow">
        {{fieldFusions}}
        <template v-if="fieldFusions">
          <div class="text-h6 q-py-sm">Possible fusions with your field and hand cards</div>
          <div>
            <template v-for="(fieldCardFusions, fieldCardId) in fieldFusions">
              <FusionRow v-for="fusion in fieldCardFusions" :fusion="fusion">
                <div>
                  <q-btn label="Select" @click="selectFusion(fusion, fieldCardId)"/>
                </div>
              </FusionRow>
            </template>
          </div>
        </template>

        <div class="text-h6 q-py-sm">Possible fusions with your hand cards</div>
        <div v-if="handFusions.length">
          <FusionRow v-for="fusion in handFusions" :fusion="fusion">
            <div>
              <q-btn label="Select" @click="selectFusion(fusion)"/>
            </div>
          </FusionRow>
        </div>
        <div v-else>
          No fusions possible :(
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import usePlayModeStore from 'stores/playMode';
import {computed, ref} from 'vue';
import {findFusions, formatFusionList, getIdsByString} from 'src/lib/fusions';
import PlayCard from 'components/PlayCard.vue';
import FusionRow from 'components/FusionRow.vue';

//#region Composable & Prepare
const playStore = usePlayModeStore();
//#endregion

//region Data
const newCards = ref('');
//endregion

//#region Computed
const fieldFusions = computed(() => {
  const possibleFusions = {};
  let fusionCount = 0;
  for ( const id of playStore.fieldCards ) {
    possibleFusions[id] = formatFusionList(findFusions(1, playStore.cards.concat(id), [], id));
    fusionCount += possibleFusions[id].length;
  }

  if ( fusionCount === 0 ) {
    return null;
  }

  return possibleFusions;
});

const handFusions = computed(() => {
  return formatFusionList(findFusions(1, playStore.cards, [], false));
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function startNewGame() {
  playStore.started = true;
  playStore.cards = [];
  playStore.fieldCards = [];
}

function addCards() {
  const ids = getIdsByString(newCards.value);
  playStore.cards.push(...ids);

  newCards.value = '';
}

function selectFusion(fusion, fieldCardId = null) {
  if (playStore.fieldCards.length === 5) {
    window.alert('Destroy one card on your field.');
    return;
  }

  const merge = fusion.merge.concat();
  if (fieldCardId) {
    merge.splice(merge.indexOf(fieldCardId), 1);
    playStore.fieldCards.splice(playStore.fieldCards.indexOf(fieldCardId), 1);
  }

  for (const id of merge) {
    const index = playStore.cards.indexOf(id);
    playStore.cards.splice(index, 1);
  }

  playStore.fieldCards.push(fusion.final);
}

function playCard(id) {
  if (playStore.fieldCards.length === 5) {
    window.alert('Destroy one card on your field.');
    return;
  }

  const index = playStore.cards.indexOf(id);
  playStore.cards.splice(index, 1);
  playStore.fieldCards.push(id);
}

//#endregion

//#region Created
//#endregion
</script>