<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-md no-wrap">
      <div style="max-width:256px">
        <div class="flex tw-sticky tw-top-[123px]">
          <div class="tw-h-12 tw-w-12" />
          <opponent-box v-for="id in 39" :id="id" class="cursor-pointer" @click="selectPerson(id)" />
        </div>
      </div>
      <div class="col-grow col-shrink full-width q-gutter-y-md">
        <div class="text-h5">
          <a :href="`https://yugipedia.com/wiki/${persons[selectedPerson].urlPath}`" target="_blank" class="text-white">
            <span>{{ persons[selectedPerson].name }}</span>
            <q-icon class="fas fa-external-link q-ml-xs"/>
            <q-tooltip>Open in Yugipedia</q-tooltip>
          </a>
        </div>

        <AppCard title="Deck" expandable>
          <div class="flex">
            <PlayCard v-for="id in persons[selectedPerson].deck" :id="id"/>
          </div>
        </AppCard>

        <AppCard title="POW S/A Drops" show expandable>
          <div class="flex">
            <PlayCard v-for="drop in powSADrops" :id="drop.id">
              <template #before-name>
                {{ drop.percent }}% ({{ drop[2048] }}/2048)<br>
              </template>
            </PlayCard>
          </div>
        </AppCard>

        <AppCard title="TEC S/A Drops" show expandable>
          <div class="flex">
            <PlayCard v-for="drop in tecSADrops" :id="drop.id">
              <template #before-name>
                {{ drop.percent }}% ({{ drop[2048] }}/2048)<br>
              </template>
            </PlayCard>
          </div>
        </AppCard>

        <AppCard title="POW/TEC: B/C/D Drops" expandable>
          <div class="flex">
            <PlayCard v-for="drop in bcdDrops" :id="drop.id">
              <template #before-name>
                {{ drop.percent }}% ({{ drop[2048] }}/2048)<br>
              </template>
            </PlayCard>
          </div>
        </AppCard>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import persons from 'src/assets/persons.json';
import {computed, ref} from 'vue';
import PlayCard from 'components/PlayCard.vue';
import AppCard from 'components/AppCard.vue';
import OpponentBox from 'components/OpponentBox.vue';

//#region Composable & Prepare
//#endregion

//#region Data
const selectedPerson = ref(0);
//#endregion

//#region Computed
const tecSADrops = computed(getDrops('TEC: S/A'));

const powSADrops = computed(getDrops('POW: S/A'));

const bcdDrops = computed(getDrops('POW/TEC: B/C/D'));

const selectablePersons = computed(() => {
  return persons.map((person, index) => ({
    value: index,
    label: person.name,
  }));
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function selectPerson(id: number) {
  selectedPerson.value = persons.findIndex((person) => person.order === id-1);
}

function getDrops(type: string) {
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