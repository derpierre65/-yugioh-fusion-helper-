<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-md no-wrap">
      <div style="min-width:200px;">
        <q-list bordered separator style="position:sticky; top:100px;">
          <q-item v-for="(person, index) of persons" clickable @click="selectedPerson = index">
            <q-item-section>{{ person.name }}</q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-grow col-shrink">
        <div class="text-h4 q-mb-md">Deck</div>
        <div class="flex">
          <PlayCard v-for="id in persons[selectedPerson].deck" :id="id"/>
        </div>

        <div class="text-h4 q-my-md">TEC S/A Drops</div>
        <div class="flex">
          <PlayCard v-for="drop in tecSADrops" :id="drop.id">
            {{ drop.percent }}% ({{ drop[2048] }}/2048)
          </PlayCard>
        </div>

        <div class="text-h4 q-my-md">POW S/A Drops</div>
        <div class="flex">
          <PlayCard v-for="drop in powSADrops" :id="drop.id">
            {{ drop.percent }}% ({{ drop[2048] }}/2048)
          </PlayCard>
        </div>

        <div class="text-h4 q-my-md">POW/TEC: B/C/D Drops</div>
        <div class="flex">
          <PlayCard v-for="drop in bcdDrops" :id="drop.id">
            {{ drop.percent }}% ({{ drop[2048] }}/2048)
          </PlayCard>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import persons from 'src/assets/persons.json';
import {computed, ref} from 'vue';
import PlayCard from 'components/PlayCard.vue';

//#region Composable & Prepare
//#endregion

//#region Data
const selectedPerson = ref(0);
//#endregion

//#region Computed
const tecSADrops = computed(getDrops('TEC: S/A'));

const powSADrops = computed(getDrops('POW: S/A'));

const bcdDrops = computed(getDrops('POW/TEC: B/C/D'));
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function getDrops(type) {
  return () => {
    const drops = persons[selectedPerson.value].drops;

    return Object.keys(drops).filter((key) => {
      return drops[key][type];
    }).map((key) => ({
      id: key,
      percent: drops[key][type].percent,
      2048: drops[key][type][2048],
    }));
  };
}

//#endregion

//#region Created
//#endregion
</script>