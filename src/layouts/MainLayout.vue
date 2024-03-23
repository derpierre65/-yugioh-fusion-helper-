<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          Yu-Gi-Oh! Forbidden Memories Fusion Helper
        </q-toolbar-title>

        <div>v0.1.0</div>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="Normal Mode" />
        <q-route-tab to="/mode/play" label="Play Mode" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
</script>
