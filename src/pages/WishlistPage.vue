<template>
  <q-page class="q-pa-lg">
    <div class="text-h6 q-mb-md">Cards on Wishlist: {{ total }} (Required Stars: {{ totalPrice }})</div>
    <div class="flex">
      <PlayCard v-for="(count, id) in savegameStore.wishlist" :id="id">
        <template #action-buttons>
          <q-btn icon="fas fa-times" color="negative" size="sm" dense @click="savegameStore.removeFromWishlist(id)">
            <q-tooltip>Remove</q-tooltip>
          </q-btn>
        </template>
        <template #before-name>
          {{ count }}x<br>
        </template>
      </PlayCard>
    </div>

    <template v-if="cardDropsByOpponent !== null">
      <div class="text-h6 q-mb-md">Drop by Opponents</div>

      <div class="flex q-gutter-md">
        <q-card v-for="(qualities, cardId) in cardDropsByOpponent">
          <q-card-section class="flex q-gutter-x-md">
            <PlayCard :id="cardId"/>
            <div>
              <template v-for="(persons, qualityName) in qualities">
                <div class="text-weight-bold">{{ qualityName }}</div>
                <ul>
                  <li v-for="person in persons">{{ person.name }}: {{ person.percent }}% ({{ person[2048] }}/2048)</li>
                </ul>
              </template>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import PlayCard from 'components/PlayCard.vue';
import useCardStore from 'stores/card';
import {computed} from 'vue';
import useSavegameStore from 'stores/savegame';
import persons from 'src/assets/persons.json';

//#region Composable & Prepare
const savegameStore = useSavegameStore();
const cardStore = useCardStore();
//#endregion

//#region Data
//#endregion

//#region Computed
const wishlistCardIds = computed(() => Object.keys(savegameStore.wishlist));

const total = computed(() => {
  return wishlistCardIds.value.reduce((prev, key) => prev + savegameStore.wishlist[key], 0);
});

const totalPrice = computed(() => {
  return wishlistCardIds.value.reduce((prev, key) => prev + savegameStore.wishlist[key] * (cardStore.cards[key].cost || 0), 0);
});

const cardDropsByOpponent = computed(() => {
  if (savegameStore.unlockedOpponents.length === 0) {
    return null;
  }

  const cardIds = wishlistCardIds.value;
  if (cardIds.length === 0) {
    return null;
  }

  const cardDropBy = {};
  let hasDrop = false;
  for (const person of persons) {
    if (!savegameStore.unlockedOpponents.includes(person.order)) {
      continue;
    }

    for (const cardId of cardIds) {
      if (!person.drops[cardId]) {
        continue;
      }

      if (typeof cardDropBy[cardId] === 'undefined') {
        cardDropBy[cardId] = {};
      }

      const dropQuality = Object.keys(person.drops[cardId]);
      for (const quality of dropQuality) {
        if (typeof cardDropBy[cardId][quality] === 'undefined') {
          cardDropBy[cardId][quality] = [];
        }

        cardDropBy[cardId][quality].push({
          name: person.name,
          ...person.drops[cardId][quality],
        });
        hasDrop = true;
      }
    }
  }

  if (!hasDrop) {
    return null;
  }

  return cardDropBy;
});
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
//#endregion

//#region Created
//#endregion
</script>