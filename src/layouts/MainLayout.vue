<template>
  <q-layout view="hHr lpR fFr" @click="close">
    <q-header bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          Yu-Gi-Oh! Forbidden Memories Fusion Helper
        </q-toolbar-title>

        <div>v{{ version }} ({{ buildDate }})</div>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="Normal Mode" no-caps />
        <q-route-tab :to="{name: 'play'}" label="Play Mode" no-caps />
        <q-route-tab :to="{name: 'my-deck'}" label="My Deck" no-caps />
        <q-route-tab :to="{name: 'password-used'}" label="Passwords used" no-caps />
        <q-route-tab :to="{name: 'wishlist'}" label="Wishlist" no-caps />
        <q-route-tab to="/database" label="Card Database" class="q-ml-lg" no-caps />
        <q-route-tab :to="{name: 'opponents'}" label="Opponents" no-caps />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-drawer
        v-model="drawer"
        :width="drawerWidth"
        side="right"
        content-class="bg-black"
        elevated
        overlay
    >
      <portal-target name="drawer"/>
    </q-drawer>
  </q-layout>

  <q-dialog v-model="globalStore.updateAvailable" seamless position="bottom">
    <q-card class="tw-w-96" dark>
      <q-card-section class="row items-center no-wrap">
        <div>New version available</div>
        <q-space />
        <q-btn color="primary" label="Refresh" @click="reloadApplication" />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="cardStore.showFusionDialog" full-width>
    <q-card class="full-width" style="background: var(--q-dark-page)">
      <q-toolbar>
        <q-toolbar-title>{{ cardStore.cards[cardStore.showFusionCard].name }} Fusions</q-toolbar-title>
        <q-icon name="fas fa-times" class="cursor-pointer" @click="cardStore.showFusionDialog = false"/>
      </q-toolbar>
      <q-card-section class="q-gutter-y-md">
        <AppCard v-if="cardStore.selectedCardFusions.to.length" title="To this card" expandable show>
          <q-card-section class="row q-col-gutter-md">
            <div v-for="fusion of cardStore.selectedCardFusions.to" :key="fusion">
              <FusionRow :fusion="fusion"/>
            </div>
          </q-card-section>
        </AppCard>
        <AppCard v-if="cardStore.selectedCardFusions.with.length" title="With this card" expandable show>
          <q-card-section class="row q-col-gutter-md">
            <div v-for="fusion of cardStore.selectedCardFusions.with" :key="fusion">
              <FusionRow :fusion="fusion"/>
            </div>
          </q-card-section>
        </AppCard>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {provide, ref} from 'vue';
import FusionRow from 'components/FusionRow.vue';
import useCardStore from 'stores/card';
import {PortalTarget} from 'portal-vue';
import useGlobalStore from 'stores/global';
import axios from 'axios';
import AppCard from 'components/AppCard.vue';
import {date} from 'quasar';

//#region Composable & Prepare
const cardStore = useCardStore();
const globalStore = useGlobalStore();
//#endregion

//#region Data
const drawer = ref(false);
const drawerWidth = ref(200);
const version = import.meta.env.VITE_PACKAGE_VERSION;
const buildDate = date.formatDate(new Date(parseInt(import.meta.env.VITE_BUILD_TIME)), 'YYYY-MM-DD HH:mm:ss');
//#endregion

//#region Computed
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function close(event: MouseEvent) {
  if (!drawer.value) {
    return;
  }

  let element = event.target as HTMLElement;
  while (element.parentElement) {
    if (element.parentElement.classList.contains('q-drawer-container')) {
      return;
    }

    element = element.parentElement;
  }

  drawer.value = false;
}

function reloadApplication() {
  window.location.reload();
}
//#endregion

//#region Created
window.setInterval(() => {
  if (globalStore.updateAvailable || import.meta.env.DEV) {
    return;
  }

  type UpdateInfo = {
    version: string;
    date: number;
  };

  axios
      .get<UpdateInfo>('/assets/version.json')
      .then(({data}) => {
        if ( data.date !== parseInt(import.meta.env.VITE_BUILD_TIME) ) {
          globalStore.$patch({
            updateAvailable: true,
          });
        }
      })
}, 60_000);
//#endregion

provide('drawer', {
  drawer,
  drawerWidth,
});
</script>
