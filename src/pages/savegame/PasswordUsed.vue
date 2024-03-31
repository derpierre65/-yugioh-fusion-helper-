<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-md">
      <div class="col-grow">
        <q-input v-model.trim="password" label="Used password" @keyup.enter="addPassword"/>
      </div>
      <div class="flex items-center">
        <q-btn label="Add" color="primary" @click="addPassword"/>
      </div>
    </div>

    <div v-if="savegameStore.passwordsUsed.length" class="text-h5 q-my-md">Your used passwords:</div>
    <PlayCard v-for="password in savegameStore.passwordsUsed" :id="cardsByPassword[password]">
      <template #action-buttons>
        <q-btn icon="fas fa-times" color="negative" size="sm" dense @click="remove(password)">
          <q-tooltip>Remove</q-tooltip>
        </q-btn>
      </template>
    </PlayCard>
  </q-page>
</template>

<script setup lang="ts">
import useSavegameStore from 'stores/savegame';
import {computed, ref} from 'vue';
import useCardStore from 'stores/card';
import PlayCard from 'components/PlayCard.vue';

//#region Composable & Prepare
const savegameStore = useSavegameStore();
const cardStore = useCardStore();
//#endregion

//#region Data
const password = ref('');
//#endregion

//#region Computed
const cardsByPassword = computed(() => {
  const cardIds = Object.keys(cardStore.cards);
  const cards: Record<string, string> = {};
  for (const cardId of cardIds) {
    const password = cardStore.cards[cardId].password;
    if (password) {
      cards[password] = cardId;
    }
  }

  return cards;
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function addPassword() {
  if ( cardsByPassword.value[password.value] ) {
    savegameStore.usePassword(password.value);
  }

  password.value = '';
}
function remove(password: string) {
  const index = savegameStore.passwordsUsed.indexOf(password);
  if (index >= 0) {
    savegameStore.passwordsUsed.splice(index, 1);
  }
}

//#endregion

//#region Created
//#endregion
</script>