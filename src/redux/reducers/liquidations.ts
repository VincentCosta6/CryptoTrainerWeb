import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LeveragedTradeType } from './leveragedTrade';

interface LiquidationState {
    liquidations: Array<LeveragedTradeType>,
}
// @ts-ignore
const initialState = {
    liquidations: [],
} as LiquidationState

export const liquidationReducer = {
    addLiquidation: (state: LiquidationState, action: PayloadAction<LeveragedTradeType>) => ({ liquidations: [...state.liquidations, action.payload]}),
    removeLiquidations: (state: LiquidationState) => ({ liquidations: [] })
}

const liquidationSlice = createSlice({
    name: 'liquidations',
    initialState,
    reducers: liquidationReducer,
})

export const { addLiquidation, removeLiquidations } = liquidationSlice.actions 

export default liquidationSlice.reducer
