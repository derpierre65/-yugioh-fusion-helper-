<template>
  <q-page class="q-pa-lg flex column items-center">
    <div class="text-h6 q-mb-md">Select your unlocked Opponents</div>

    <div class="flex q-gutter-x-md">
      <q-btn label="Lock all" color="primary" class="q-mb-md" no-caps @click="lockAll" />
      <q-btn label="Unlock all" color="primary" class="q-mb-md" no-caps @click="unlockAll" />
    </div>

    <div style="max-width:256px">
      <div class="flex tw-sticky tw-top-[123px]">
        <div class="tw-h-12 tw-w-12"/>
        <opponent-box
          v-for="id in 39"
          :id="id"
          :class="{'tw-opacity-50': !savegameStore.unlockedOpponents.includes(id-1)}"
          class="cursor-pointer"
          @click="togglePerson(id)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import OpponentBox from 'components/OpponentBox.vue';
import useSavegameStore from 'stores/savegame';

//#region Composable & Prepare
const savegameStore = useSavegameStore();
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
function togglePerson(id: number) {
  if (id === 39) {
    return;
  }

  id--;

  const index = savegameStore.unlockedOpponents.indexOf(id);
  if (index >= 0) {
    savegameStore.unlockedOpponents.splice(index, 1);
  } else {
    savegameStore.unlockedOpponents.push(id);
  }
}

function lockAll() {
  for (let id = 0; id < 38; id++) {
    const index = savegameStore.unlockedOpponents.indexOf(id);
    if (index >= 0) {
      savegameStore.unlockedOpponents.splice(index, 1);
    }
  }
}
function unlockAll() {
  for (let id = 0; id < 38; id++) {
    const index = savegameStore.unlockedOpponents.indexOf(id);
    if (index === -1) {
      savegameStore.unlockedOpponents.push(id);
    }
  }
}
//#endregion

//#region Created
//#endregion
</script>