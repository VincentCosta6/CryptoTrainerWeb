import { useAppSelector } from "../store"

export const useMarketTradesLoading = () => useAppSelector(({ trades }) => trades.loading)

export const useTrades = () => useAppSelector(({ trades }) => trades.trades)
