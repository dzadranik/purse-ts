import type { CurrencyPair } from "../../utils/types";

export default {
  getRestDepth: (currencyPair: CurrencyPair, limit: number) =>
    fetch(
      `https://api.binance.com/api/v3/depth?symbol=${currencyPair}&limit=${limit}`
    ),
  getStreamDepth: (currencyPair: string) =>
    new WebSocket(`wss://stream.binance.com:9443/ws/${currencyPair}@depth`),
};
