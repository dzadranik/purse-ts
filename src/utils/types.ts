import type { Ref } from "vue";

export type CurrencyPair = "BTCUSDT" | "BNBBTC" | "ETHBTC";

export type ChangeLog = Ref<[CurrencyPair, CurrencyPair, string][]>;
