import { useAppSelector } from "../store"

export const useMarketTrades = () => useAppSelector(({ marketTrades }) => marketTrades.trades)
