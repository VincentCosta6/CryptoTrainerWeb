import { useAppSelector } from "../store"

export const useLeveragedTradesLoading = () => useAppSelector(({ leveragedTrades }) => leveragedTrades.loading)

export const useLeveragedTrades = () => useAppSelector(({ leveragedTrades }) => leveragedTrades.leveragedTrades)
