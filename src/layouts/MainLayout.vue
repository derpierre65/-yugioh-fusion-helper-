<template>
  <q-layout view="hHr lpR fFr">
    <q-header bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          Yu-Gi-Oh! Forbidden Memories Fusion Helper
        </q-toolbar-title>

        <div>v0.3.0</div>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="Normal Mode" />
        <q-route-tab :to="{name: 'play'}" label="Play Mode" />
        <q-route-tab to="/database" label="Database" />
        <q-route-tab :to="{name: 'my-deck'}" label="My Deck" />
        <q-route-tab :to="{name: 'opponents'}" label="Opponents" />
        <q-route-tab :to="{name: 'wishlist'}" label="Wishlist" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-drawer v-model="drawer" overlay :width="drawerWidth" side="right" content-class="bg-black">
      soon.
    </q-drawer>
  </q-layout>

  <q-dialog v-model="cardStore.showFusionDialog" full-width>
    <q-card class="full-width">
      <q-toolbar>
        <q-toolbar-title>{{cardStore.cards[cardStore.showFusionCard].name}} Fusions</q-toolbar-title>
        <q-icon name="close" size="md" class="cursor-pointer" @click="cardStore.showFusionDialog = false" />
      </q-toolbar>
      <template v-if="cardStore.selectedCardFusions.to.length">
        <span class="text-h5 q-pl-md">To this card</span>
        <q-card-section class="row q-col-gutter-md">
          <div v-for="fusion of cardStore.selectedCardFusions.to">
            <FusionRow :fusion="fusion" />
          </div>
        </q-card-section>
      </template>

      <template v-if="cardStore.selectedCardFusions.with.length">
        <span class="text-h5 q-pl-md">With this card</span>
        <q-card-section class="row q-col-gutter-md">
          <div v-for="fusion of cardStore.selectedCardFusions.with">
            <FusionRow :fusion="fusion" />
          </div>
        </q-card-section>
      </template>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {provide, ref} from 'vue';
import FusionRow from 'components/FusionRow.vue';
import useCardStore from 'stores/card';

//#region Composable & Prepare
const cardStore = useCardStore();
//#endregion

//#region Data
const drawer = ref(false);
const drawerWidth = ref(200);
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

provide('drawer', {
  drawer,
  drawerWidth,
});
</script>
