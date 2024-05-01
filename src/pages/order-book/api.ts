import type { CurrencyPair } from "../../utils/types";
import type { Limit } from "./types";

export default {
  getRestDepth: (currencyPair: CurrencyPair, limit: Limit) =>
    fetch(
      `https://api.binance.com/api/v3/depth?symbol=${currencyPair}&limit=${limit}`
    ),
  getStreamDepth: (currencyPair: string) =>
    new WebSocket(`wss://stream.binance.com:9443/ws/${currencyPair}@depth`),
};
