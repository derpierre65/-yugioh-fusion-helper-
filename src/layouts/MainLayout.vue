<template>
  <q-layout view="hHr lpR fFr">
    <q-header bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          Yu-Gi-Oh! Forbidden Memories Fusion Helper
        </q-toolbar-title>

        <div>v0.2.0</div>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="Normal Mode" />
        <q-route-tab to="/mode/play" label="Play Mode" />
        <q-route-tab to="/database" label="Database" />
        <q-route-tab :to="{name: 'my-deck'}" label="My Deck" />
        <q-route-tab :to="{name: 'opponents'}" label="Opponents" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-drawer v-model="drawer" overlay :width="drawerWidth" side="right" content-class="bg-black">
      soon.
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import {provide, ref} from 'vue';

const drawer = ref(false);
const drawerWidth = ref(200);

provide('showDrawer', {
  drawer,
  drawerWidth,
});
</script>
