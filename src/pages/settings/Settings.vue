<script setup lang="ts">
import { usePairStore } from "../../store/pair";
import { watch, ref, onBeforeMount } from "vue";
import type { CurrencyPair, ChangeLog } from "../../utils/types";

const store = usePairStore();

const changeLog: ChangeLog = ref([]);

const currencyPairs: CurrencyPair[] = ["BTCUSDT", "BNBBTC", "ETHBTC"];

watch(
  () => store.currencyPairValue,
  (newValue, oldValue): void => {
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    changeLog.value = [[oldValue, newValue, time], ...changeLog.value];
    localStorage.setItem("changeLog", JSON.stringify(changeLog.value));
  }
);

onBeforeMount(() => {
  changeLog.value = JSON.parse(localStorage.getItem("changeLog") || "[]");
});
</script>

<template>
  <div class="custom-content__select-wrap">
    <v-select
      label="Currency pair"
      v-model="store.currencyPairValue"
      density="compact"
      :items="currencyPairs"
      variant="outlined"
      class="mx-5 mt-5"
    ></v-select>
  </div>
  <div class="custom-content__panel">
    <v-list lines="one" class="ml-1">
      <v-list-item
        v-for="([oldValue, newValue, time], key) in changeLog"
        :key
        :title="`${oldValue} >> ${newValue}`"
        :subtitle="time"
      ></v-list-item>
    </v-list>
  </div>
</template>
