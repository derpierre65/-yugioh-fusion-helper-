<template>
  <q-page class="q-pa-lg">
    <!--region add card container-->
    <div class="row q-col-gutter-md">
      <div class="col-grow">
        <q-input
            v-model="newCards"
            label="New Cards"
            hint="Add cards to your deck. Split multiple Card ids with , or space. example: 604,102,123,101,586"
            @keyup.enter="addCards"
        />
      </div>
      <div class="flex items-center">
        <q-btn label="Add Cards" color="primary" @click="addCards"/>
      </div>
    </div>
    <!--endregion-->

    <span class="text-h6">Your deck {{ deckStore.cards.length }}/40:</span>
    <div class="flex">
      <PlayCard v-for="id in deckStore.cards" :id="id">
        <q-btn label="Remove" color="red" @click="removeCard(id)"/>
      </PlayCard>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import useDeckStore from 'stores/deck';
import {ref} from 'vue';
import {getIdsByString} from 'src/lib/fusions';
import PlayCard from 'components/PlayCard.vue';

//#region Composable & Prepare
const deckStore = useDeckStore();
//#endregion

//#region Data
const newCards = ref('');
//#endregion

//#region Computed
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function addCards() {
  if (deckStore.cards.length === 40) {
    return false;
  }

  const ids = getIdsByString(newCards.value);
  if (deckStore.cards.length + ids.length > 40) {
    return false;
  }

  deckStore.cards.push(...ids);
  deckStore.cards = deckStore.cards.sort((a, b) => {
    return parseInt(a) > parseInt(b) ? 1 : -1;
  });
  newCards.value = '';
}

function removeCard(id) {
  deckStore.cards.splice(deckStore.cards.indexOf(id), 1);
}

//#endregion

//#region Created
//#endregion
</script>