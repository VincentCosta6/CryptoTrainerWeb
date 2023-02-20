import { useAppSelector } from "../store"

export const useLiquidations = () => useAppSelector(({ liquidations }) => liquidations.liquidations)
