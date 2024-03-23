<template>
  <q-page class="q-pa-lg">
    <q-card class="q-mb-md">
      <q-card-section>
        <form @submit.prevent="reset">
          <span class="text-h6">Filter</span>
          <div class="row q-gutter-x-md">
            <div class="col-grow">
              <q-input v-model="filter.minCosts" type="number" label="Min Cost"/>
            </div>
            <div class="col-grow">
              <q-input v-model="filter.maxCosts" type="number" label="Max Cost"/>
            </div>
          </div>
          <div class="row q-gutter-x-md">
            <div class="col-grow">
              <q-input v-model="filter.minAtk" type="number" label="Min Atk"/>
            </div>
            <div class="col-grow">
              <q-input v-model="filter.minDef" type="number" label="Min Def"/>
            </div>
          </div>
          <div class="row q-gutter-x-md">
            <div class="col-grow">
              <q-select v-model="filter.sort" :options="sortValues" label="First Sort Level" map-options emit-value/>
            </div>
            <div class="col-grow">
              <q-select v-model="filter.secondSort" :options="sortValues" label="Second Sort Level" map-options emit-value/>
            </div>
          </div>

          <q-btn label="Filter" color="primary" type="submit"/>
        </form>
      </q-card-section>
    </q-card>

    <q-infinite-scroll ref="infiniteScroll" @load="loadMore">
      <div class="flex">
        <PlayCard v-for="id in cardList" :id="id">
          <a :href="getLink(id)">{{cardStore.cards[id].name}}</a><br>
          {{ cardStore.cards[id].password }} = {{ cardStore.cards[id].cost }}
        </PlayCard>
      </div>
    </q-infinite-scroll>
  </q-page>
</template>

<script setup lang="ts">
import useCardStore from 'stores/card';
import {computed, nextTick, ref, watch} from 'vue';
import PlayCard from 'components/PlayCard.vue';
import {QInfiniteScroll} from 'quasar';

//#region Composable & Prepare
const cardStore = useCardStore();
//#endregion

//#region Data
const filter = ref({
  minCosts: 0,
  maxCosts: 0,
  minAtk: 0,
  minDef: 0,
  sort: 'cost',
  secondSort: 'atk',
});
const sortValues = Object.freeze([
  {label: 'Attack', value: 'atk'},
  {label: 'Defense', value: 'def'},
  {label: 'Cost', value: 'cost'},
]);
const cardList = ref([]);
const cardIds = Object.keys(cardStore.cards);
const infiniteScroll = ref<QInfiniteScroll>();
//#endregion

//#region Computed
const filteredCardIds = computed(() => {
  const minCosts = filter.value.minCosts;
  const maxCosts = filter.value.maxCosts;
  const minAtk = filter.value.minAtk;
  const minDef = filter.value.minDef;
  const firstSort = filter.value.sort;
  const secondSort = filter.value.secondSort;
  let cardListIds = cardIds;

  if (minCosts || maxCosts || minAtk || minDef) {
    cardListIds = cardListIds.filter((cardId) => {
      const card = cardStore.cards[cardId];
      if ((minCosts || maxCosts) && !card.cost) {
        return false;
      }
      if (maxCosts && card.cost > maxCosts) {
        return false;
      }
      if (minCosts && card.cost < minCosts) {
        return false;
      }
      if (minAtk && (!card.atk || card.atk < minAtk)) {
        return false;
      }

      return !(minDef && (!card.def || card.def < minDef));
    });
  }

  return cardListIds.sort((a, b) => {
    const aCard = cardStore.cards[a];
    const bCard = cardStore.cards[b];

    if (aCard[firstSort] === bCard[firstSort]) {
      return aCard[secondSort] < bCard[secondSort] ? 1 : -1;
    }

    return aCard[firstSort] < bCard[firstSort] ? 1 : -1;
  });
});
//#endregion

//#region Watch
watch(filter, reset, {
  deep: true,
});
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function getLink(id) {
  const card = cardStore.cards[id];
  const urlPathName = card.name.replace(/#/g, "");

  return `https://yugipedia.com/wiki/${urlPathName} (FMR)`;
}

function reset() {
  nextTick(() => {
    cardList.value = [];
    const scroll = infiniteScroll.value!;
    scroll.setIndex(0);
    scroll.resume();
    scroll.trigger();
  });
}

function loadMore(index: number, done) {
  const nextCards = filteredCardIds.value.slice((index - 1) * 50, index * 50);
  cardList.value.push(...nextCards);
  done(nextCards.length !== 50);
}

//#endregion

//#region Created
//#endregion
</script>