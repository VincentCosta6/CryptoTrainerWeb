import { useAppSelector } from "../store"

export const usePriceLoading = () => useAppSelector(({ price }) => price.loading)

export const useSelectedInterval = () => useAppSelector(({ price }) => price.selectedInterval)

export const useSubscriptions = () => useAppSelector(({ price }) => price.subscriptions)

export const useWebsocketConnected = () => useAppSelector(({ price }) => price.websocketConnected)

export const usePrices = () => useAppSelector(({ price }) => price.prices)

export const useLastPrice = () => useAppSelector(({ price }) => price.lastPrice)

