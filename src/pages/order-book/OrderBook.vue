<script setup lang="ts">
import api from "./api.ts";
import { usePairStore } from "../../store/pair";
import { onBeforeMount, ref, onBeforeUnmount, shallowRef } from "vue";
import type { ShallowRef, Ref } from "vue";
import type {
  Buffer,
  Data,
  FilterData,
  FullData,
  InitData,
  Socket,
} from "./types.ts";

const store = usePairStore();
const limits = [100, 500, 1000];
const limit = ref(100);

const socket: Ref<Socket | null> = ref(null);
const buffer: ShallowRef<Buffer> = shallowRef({});
const lastU: Ref<number | null> = ref(null);
const lastUpdateId: Ref<number> = ref(0);
const data: Ref<Data> = ref([]);

const isLoading = ref(false);
const isError = ref(false);

let filterData: FilterData = function (newData, oldData = []) {
  let arr = newData.reduce((acc: FullData[], [p, q]): FullData[] => {
    const numberP = Number(p);
    const numberQ = Number(q);
    if (numberQ > 0) {
      const total = (numberP * numberQ).toFixed(5);
      return [...acc, [numberP.toFixed(2), numberQ.toFixed(5), total]];
    }
    return acc;
  }, []);

  return [...arr, ...oldData].slice(0, limit.value);
};

function clearData(errorValue = false) {
  data.value = [];
  buffer.value = {};
  lastU.value = null;
  lastUpdateId.value = 0;
  isLoading.value = false;

  if (socket.value) {
    socket.value.close();
  }

  isError.value = errorValue;
}

async function getShot() {
  try {
    isLoading.value = true;

    const response = await api.getRestDepth(
      store.currencyPairValue,
      limit.value
    );
    const json: { bids: InitData[]; asks: InitData[]; lastUpdateId: number } =
      await response.json();
    lastUpdateId.value = json.lastUpdateId;
    data.value = [filterData(json.bids), filterData(json.asks)];

    isLoading.value = false;
  } catch (error) {
    clearData(true);
  }
}

function updateShot() {
  const bufferValue = buffer.value;
  const [b, a] = data.value;

  if (lastU.value) {
    const lastUValueNext = (lastU.value + 1).toString();
    lastU.value = null;
    buffer.value = {};

    if (bufferValue[lastUValueNext]) {
      data.value = [
        filterData(bufferValue[lastUValueNext].b, b),
        filterData(bufferValue[lastUValueNext].a, a),
      ];

      lastU.value = bufferValue[lastUValueNext].u;
    }
  } else if (lastUpdateId.value) {
    for (const [key, value] of Object.entries(bufferValue)) {
      if (Number(key) > lastUpdateId.value && lastUpdateId.value < value.u) {
        const lastUValueNext = key.toString();
        data.value = [
          filterData(bufferValue[lastUValueNext].b, b),
          filterData(bufferValue[lastUValueNext].a, a),
        ];

        lastU.value = bufferValue[lastUValueNext].u;
        lastUpdateId.value = 0;
      }
    }
  }
}

async function loadData() {
  clearData();
  getShot();
  socket.value = api.getStreamDepth(store.currencyPairValue.toLowerCase());

  socket.value.onmessage = function (event) {
    let { a, b, u, U } = JSON.parse(event.data);
    buffer.value[U] = { a, b, u };
    updateShot();
  };

  socket.value.onclose = function (event) {
    if (!event.wasClean) {
      clearData(true);
    }
  };

  socket.value.onerror = function () {
    clearData(true);
  };
}

onBeforeMount(() => {
  loadData();
});

onBeforeUnmount(() => {
  clearData();
});
</script>

<template>
  <div class="custom-content__select-wrap">
    <v-select
      label="Limit"
      v-model="limit"
      :items="limits"
      density="compact"
      variant="outlined"
      class="mx-5 mt-5"
      @update:modelValue="loadData"
    ></v-select>
  </div>

  <div class="ml-5 custom-content__panel">
    <v-alert
      color="error"
      v-if="isError"
      title="Ошибка"
      text="Что-то пошло не так"
      class="pb-6 mr-5 mt-5"
    ></v-alert>
    <div class="d-flex" v-else>
      <div class="custom-content__column">
        <v-skeleton-loader type="table" v-if="isLoading"></v-skeleton-loader>
        <v-table
          density="compact"
          v-else
          fixed-header
          class="pr-5 text-right custom-content__table"
        >
          <colgroup>
            <col class="custom-content__td-p" />
            <col class="custom-content__td-p d-none" />
            <col class="custom-content__td-total" />
          </colgroup>
          <thead>
            <tr>
              <th class="text-right font-weight-black pr-0">Price</th>
              <th
                class="text-right font-weight-black d-sm-table-cell d-none pr-0"
              >
                Quantity
              </th>
              <th class="text-right font-weight-black pr-0">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="([price, quantity, total], index) in data[0]"
              :key="`bids${index}`"
            >
              <td class="pr-0">{{ price }}</td>
              <td class="d-sm-table-cell d-none pr-0">{{ quantity }}</td>
              <td class="pr-0">{{ total }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <div class="custom-content__column">
        <v-skeleton-loader type="table" v-if="isLoading"></v-skeleton-loader>
        <v-table
          density="compact"
          v-else
          fixed-header
          class="text-right custom-content__table"
        >
          <colgroup>
            <col class="custom-content__td-p pr-0" />
            <col class="custom-content__td-p d-none pr-0" />
            <col class="custom-content__td-total pr-0" />
          </colgroup>
          <thead>
            <tr>
              <th class="text-right font-weight-black pr-0">Price</th>
              <th
                class="text-right font-weight-black d-sm-table-cell d-none pr-0"
              >
                Quantity
              </th>
              <th class="text-right font-weight-black pr-0">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="([price, quantity, total], index) in data[1]"
              :key="`asks${index}`"
            >
              <td class="pr-0">{{ price }}</td>
              <td class="d-sm-table-cell d-none pr-0">{{ quantity }}</td>
              <td class="pr-0">{{ total }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-content__column {
  width: 400px;
  max-width: 100%;
}

.custom-content__table :deep(table) {
  table-layout: fixed;
}

.custom-content__table :deep(.v-table__wrapper) {
  overflow: unset;
}

.custom-content__td-p {
  width: 70px;
}

.custom-content__td-total {
  width: 140px;
}
</style>
