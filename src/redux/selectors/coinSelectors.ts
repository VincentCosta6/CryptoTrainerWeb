import { useAppSelector } from "../store"

export const useCoins = () => useAppSelector(({ coins }) => coins.coins)

export const useCoinMap = () => useAppSelector(({ coins }) => coins.map)

export const useCoinsLoading = () => useAppSelector(({ coins }) => coins.loading)

export const useSelectedCoin = () => useAppSelector(({ coins }) => coins.selectedCoin)
