<template>
  <q-page class="q-pa-lg">
    <div class="text-center">
      <q-btn label="New duel" color="primary" @click="reset"/>
      <br><br>
      <div class="text-h6">Your points: {{ points }} ({{rank}})</div>
    </div>

    <div class="tw-grid tw-grid-cols-2 tw-gap-x-16">
      <q-input
          v-for="(factor, factorName) in pointFactors"
          v-model.number="currentValues[factorName]"
          :label="factor.label"
          :hint="factor.hint"
          type="number"
          min="0"
          tabindex="5"
          bottom-slots
      >
        <template #counter>
          {{calculatedPoints[factorName]}}
        </template>
        <template #before>
          <q-btn label="-1" color="green" :disable="currentValues[factorName] === 0" @click="addValue(factorName, -1)"/>
          <q-btn label="0" color="green" :disable="currentValues[factorName] === 0"
                 @click="currentValues[factorName] = 0"/>
        </template>
        <template #after>
          <q-btn label="+1" color="green" @click="addValue(factorName, 1)"/>
          <q-btn label="+2" color="green" @click="addValue(factorName, 2)"/>
        </template>
      </q-input>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {computed, ComputedRef, reactive, ref} from 'vue';

type PointValue = {
  min: number;
  max: number;
  points: number | string;
};

type PointFactor = {
  label: string;
  hint?: string;
  points: PointValue[];
};

//#region Composable & Prepare
//#endregion

//#region Data
const pointFactors: Record<string, PointFactor> = {
  turns: {
    label: 'Turns',
    points: [
      {min: 0, max: 4, points: 12},
      {min: 5, max: 8, points: 8},
      {min: 9, max: 28, points: 0},
      {min: 29, max: 32, points: -8},
      {min: 33, max: 36, points: -12},
    ],
  },
  effectiveAttacks: {
    label: 'Effective Attacks',
    hint: 'When your monster destroys an opponent\'s monster that is in Attack Mode',
    points: [
      {min: 0, max: 1, points: 4},
      {min: 2, max: 3, points: 2},
      {min: 4, max: 9, points: 0},
      {min: 10, max: 19, points: -2},
      {min: 20, max: 160, points: -4},
    ],
  },
  defensiveWins: {
    label: 'Defensive Wins',
    hint: 'When an opponent\'s monster attacks your monster that is in Defense Mode and your monster is not destroyed',
    points: [
      {min: 0, max: 1, points: 0},
      {min: 2, max: 5, points: -10},
      {min: 6, max: 9, points: -20},
      {min: 10, max: 14, points: -30},
      {min: 15, max: 180, points: -40},
    ],
  },
  faceDownPlays: {
    label: 'Face-Down Plays',
    points: [
      {min: 0, max: 0, points: 0},
      {min: 1, max: 10, points: -2},
      {min: 11, max: 20, points: -4},
      {min: 21, max: 30, points: -6},
      {min: 31, max: 36, points: -8},
    ],
  },
  initiateFusion: {
    label: 'Initiate Fusion',
    points: [
      {min: 0, max: 0, points: 4},
      {min: 1, max: 4, points: 0},
      {min: 5, max: 9, points: -4},
      {min: 10, max: 14, points: -8},
      {min: 15, max: 100, points: -12},
    ],
  },
  equipMagic: {
    label: 'Equip Magic',
    points: [
      {min: 0, max: 0, points: 4},
      {min: 1, max: 4, points: 0},
      {min: 5, max: 9, points: -4},
      {min: 10, max: 14, points: -8},
      {min: 15, max: 100, points: -12},
    ],
  },
  pureMagic: {
    label: 'Pure Magic',
    points: [
      {min: 0, max: 0, points: 2},
      {min: 1, max: 4, points: -4},
      {min: 5, max: 9, points: -8},
      {min: 10, max: 14, points: -12},
      {min: 15, max: 100, points: -16},
    ],
  },
  triggerTrap: {
    label: 'Trigger Trap',
    points: [
      {min: 0, max: 0, points: 2},
      {min: 1, max: 2, points: -8},
      {min: 3, max: 4, points: -16},
      {min: 5, max: 6, points: -24},
      {min: 7, max: 36, points: -32},
    ],
  },
  cardsUsed: {
    label: 'Cards Used',
    points: [
      {min: 0, max: 8, points: 15},
      {min: 9, max: 12, points: 12},
      {min: 13, max: 32, points: 0},
      {min: 33, max: 36, points: -5},
      {min: 37, max: 40, points: -7},
    ],
  },
  remainingLP: {
    label: 'Remaining LP',
    points: [
      {min: 0, max: 99, points: -7},
      {min: 100, max: 999, points: -5},
      {min: 1000, max: 6999, points: 0},
      {min: 7000, max: 7999, points: 4},
      {min: 8000, max: 8000, points: 6},
    ],
  },
};
const currentValues = ref<Record<keyof typeof pointFactors, number>>({});
const calculatedPoints = reactive<Record<keyof typeof pointFactors, ComputedRef<number>>>({});
//#endregion

//#region Computed
const factors = computed(() => Object.keys(pointFactors));
const points = computed(() => {
  let points = 50;
  for ( const factor of factors.value ) {
    points += calculatedPoints[factor] as unknown as number;
  }

  return points;
});

const rank = computed(() => getPointValue(points.value, [
  {min: 0, max: 9, points: 'TEC S'},
  {min: 10, max: 19, points: 'TEC A'},
  {min: 20, max: 29, points: 'TEC B'},
  {min: 30, max: 39, points: 'TEC C'},
  {min: 40, max: 49, points: 'TEC D'},
  {min: 50, max: 59, points: 'POW D'},
  {min: 60, max: 69, points: 'POW C'},
  {min: 70, max: 79, points: 'POW B'},
  {min: 80, max: 89, points: 'POW A'},
  {min: 90, max: 99, points: 'POW S'},
], 'Unknown'));
//#endregion

//#region Watch
//#endregion

//#region Lifecycle Events
//#endregion

//#region Methods
function addValue(key: keyof typeof pointFactors, value: number) {
  currentValues.value[key] += value;
  if (currentValues.value[key] <= 0) {
    currentValues.value[key] = 0;
  }
}

function getPointValue<T>(currentValue: number, pointValues: PointValue[], defaultValue: T) {
  for (const value of pointValues) {
    if (currentValue >= value.min && currentValue <= value.max) {
      return value.points as T;
    }
  }

  return defaultValue;
}

function calculatePoints<T>(key: keyof typeof pointFactors): () => T {
  return () => {
    console.log(`recalculate for key: ${key}`);
    return getPointValue<T>(currentValues.value[key], pointFactors[key].points, 0);
  };
}

function reset() {
  for (const factor of factors.value) {
    currentValues.value[factor] = 0;
  }

  currentValues.value.remainingLP = 8000;
  currentValues.value.turns = 1;
  currentValues.value.cardsUsed = 5;
}

//#endregion

//#region Created
reset();

for (const key of factors.value) {
  calculatedPoints[key] = computed(calculatePoints<number>(key));
}
//#endregion
</script>