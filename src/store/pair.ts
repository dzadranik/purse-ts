import { defineStore } from "pinia";
import type { CurrencyPair } from "../utils/types";

interface State {
  currencyPairValue: CurrencyPair;
}

export const usePairStore = defineStore("pair", {
  state: (): State => {
    return {
      currencyPairValue: "BTCUSDT",
    };
  },
});
