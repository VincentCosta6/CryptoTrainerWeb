import { useAppSelector } from "../store"

export const useUserLoading = () => useAppSelector(({ user }) => user.loading)

export const useUserUUID = () => useAppSelector(({ user }) => user.uuid)

export const useUsername = () => useAppSelector(({ user }) => user.username)

export const useUserDollarBalance = () => useAppSelector(({ user }) => user.dollars)
