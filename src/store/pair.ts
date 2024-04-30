import { defineStore } from "pinia";
import type { CurrencyPair } from "../utils/types";

type State = {
  currencyPairValue: CurrencyPair;
}

export const usePairStore = defineStore("pair", {
  state: (): State => {
    return {
      currencyPairValue: "BTCUSDT",
    };
  },
});
