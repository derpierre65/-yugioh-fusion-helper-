<template>
  <q-page class="q-pa-lg">
    <div class="text-center">
      <q-btn label="Start new game" color="primary" @click="startNewGame"/>
    </div>

    <portal to="drawer">
      <div class="flex justify-end">
        <q-icon name="close" size="md" class="cursor-pointer" @click="drawer = false">
          <q-tooltip>Close</q-tooltip>
        </q-icon>
      </div>
      <div class="row">
        <PlayCard v-for="id in availableDeckCards" :id="id">
          <q-btn label="Add to hand" color="green" @click="addToHand(id)"/>
        </PlayCard>
      </div>
    </portal>

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
      <div class="flex items-center q-col-gutter-xs">
        <div>
          <q-btn label="Add Cards" color="primary" @click="addCards"/>
        </div>
        <div>
          <q-btn label="Add Card from deck" color="primary" @click.stop="drawer = true"/>
        </div>
      </div>
    </div>
    <!--endregion-->

    <div class="flex q-col-gutter-sm">
      <div style="min-width:700px;">
        <div style="position: sticky; top: 100px;">
          <template v-if="playStore.cards.length">
            <div class="text-h6 q-py-sm">Your hand cards</div>
            <div class="row">
              <PlayCard v-for="id in playStore.cards" :id="id">
                <q-btn label="Play" color="positive" @click="playCard(id)"/>
                <q-btn label="To deck" color="primary" @click="cardBackToDeck(id)"/>
              </PlayCard>
            </div>
          </template>
          <template v-if="playStore.fieldCards.length">
            <div class="text-h6 q-mt-md">Your field cards</div>
            <div class="row">
              <PlayCard v-for="id in playStore.fieldCards" :id="id">
                <q-btn label="Destroy" color="red" @click="destroyFieldCard(id)"/>
              </PlayCard>
            </div>
          </template>
        </div>
      </div>
      <div v-if="playStore.cards.length" class="col-grow">
        <template v-if="fieldFusions">
          <div class="text-h6 q-py-sm">Possible fusions with your field and hand cards</div>
          <div>
            <template v-for="(fieldCardFusions, fieldCardId) in fieldFusions">
              <FusionRow v-for="fusion in fieldCardFusions" :fusion="fusion">
                <div>
                  <q-btn label="Select" color="primary" @click="selectFusion(fusion, fieldCardId)"/>
                </div>
              </FusionRow>
            </template>
          </div>
        </template>

        <div class="text-h6 q-py-sm">Possible fusions with your hand cards</div>
        <div v-if="handFusions.length">
          <FusionRow v-for="fusion in handFusions" :fusion="fusion">
            <div>
              <q-btn label="Select" color="primary" @click="selectFusion(fusion)"/>
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
import {computed, inject, provide, ref} from 'vue';
import {findFusions, formatFusionList, getIdsByString} from 'src/lib/fusions';
import PlayCard from 'components/PlayCard.vue';
import FusionRow from 'components/FusionRow.vue';
import useDeckStore from 'stores/deck';
import {Portal} from 'portal-vue';

//#region Composable & Prepare
const {drawer, drawerWidth} = inject('drawer')!;

const playStore = usePlayModeStore();
const deckStore = useDeckStore();
//#endregion

//region Data
const newCards = ref('');
//endregion

//#region Computed
const fieldFusions = computed(() => {
  const possibleFusions = {};
  let fusionCount = 0;
  for (const id of playStore.fieldCards) {
    possibleFusions[id] = formatFusionList(findFusions(1, playStore.cards.concat(id), [], id));
    fusionCount += possibleFusions[id].length;
  }

  if (fusionCount === 0) {
    return null;
  }

  return possibleFusions;
});

const handFusions = computed(() => {
  return formatFusionList(findFusions(1, playStore.cards, [], false));
});

const stackedDeckCards = computed(() => {
  const deckCardIds = deckStore.cards;
  const stackedCards = Object.create(null);
  for (const id of deckCardIds) {
    if (!stackedCards[id]) {
      stackedCards[id] = 0;
    }
    stackedCards[id]++;
  }

  return stackedCards;
});

const availableDeckCards = computed(() => {
  const drawn = playStore.drawn.concat();
  const stackedCards = Object.assign({}, stackedDeckCards.value);

  return Object.keys(stackedCards).filter((id) => {
    const index = drawn.indexOf(id);
    if (index === -1) {
      return true;
    }

    stackedCards[id] -= drawn.filter((drawnId) => drawnId === id).length;

    return stackedCards[id] > 0;
  });
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function startNewGame() {
  playStore.started = true;
  playStore.drawn = [];
  playStore.cards = [];
  playStore.fieldCards = [];
}

function addCards() {
  if (playStore.cards.length === 5) {
    return false;
  }

  const ids = getIdsByString(newCards.value);
  if ((playStore.cards.length + ids.length) > 5) {
    return false;
  }

  playStore.cards.push(...ids);
  playStore.drawn.push(...ids);

  newCards.value = '';

  return true;
}

function selectFusion(fusion, fieldCardId = null) {
  const merge = fusion.merge.concat();
  if (fieldCardId) {
    merge.splice(merge.indexOf(fieldCardId), 1);
    destroyFieldCard(fieldCardId);
  }

  for (const id of merge) {
    const index = playStore.cards.indexOf(id);
    playStore.cards.splice(index, 1);
    deckStore.addFusion(id);
  }

  playStore.fieldCards.push(fusion.final);
}

function playCard(id: string) {
  const index = playStore.cards.indexOf(id);
  playStore.cards.splice(index, 1);
  playStore.fieldCards.push(id);
}

function cardBackToDeck(id: string) {
  const index = playStore.cards.indexOf(id);
  playStore.cards.splice(index, 1);
  const drawnIndex = playStore.drawn.indexOf(id);
  if ( drawnIndex >= 0 ) {
    playStore.drawn.splice(drawnIndex, 1);
  }
}

function destroyFieldCard(id: string) {
  playStore.fieldCards.splice(playStore.fieldCards.indexOf(id), 1);
}

function addToHand(id: string) {
  const beforeValue = newCards.value;
  newCards.value = id;
  addCards();
  newCards.value = beforeValue;
  if (playStore.cards.length >= 5) {
    drawer.value = false;
  }
}

//#endregion

//#region Created
drawerWidth.value = 1450;
//#endregion
</script>