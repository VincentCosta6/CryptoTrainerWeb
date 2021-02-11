import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LeveragedTradeType } from './leveragedTrade';

interface LiquidationState {
    liquidations: Array<LeveragedTradeType>,
    alreadyLiquidated: Array<LeveragedTradeType>,
}
// @ts-ignore
const initialState = {
    liquidations: [],
    alreadyLiquidated: [],
} as LiquidationState

export const liquidationReducer = {
    addLiquidation: (state: LiquidationState, action: PayloadAction<LeveragedTradeType>) => ({ ...state, liquidations: [...state.liquidations, action.payload]}),
    removeLiquidations: (state: LiquidationState, action: PayloadAction) => ({ alreadyLiquidated: [...state.alreadyLiquidated, ...state.liquidations], liquidations: [] }),
}

const liquidationSlice = createSlice({
    name: 'liquidations',
    initialState,
    // @ts-ignore
    reducers: liquidationReducer,
})

export const { addLiquidation, removeLiquidations } = liquidationSlice.actions 

export default liquidationSlice.reducer
