import { useAppSelector } from "../store"

export const useUserCoinBalance = () => useAppSelector(({ usersCoins }) => usersCoins.tickers)

export const useUserCoinBalanceLoading = () => useAppSelector(({ usersCoins }) => usersCoins.loading)

