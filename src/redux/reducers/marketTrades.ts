import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface MarketTradeType {
    externalId: string
    orderSide: 'SELLSIDE' | 'BUYSIDE'
    amountStr: string
    priceStr: string
}

interface MarketTradeState {
    trades: Array<MarketTradeType>
}

const initialState = {
    trades: [],
} as MarketTradeState

export const marketTradesReducer = {
    addTrades: (state: MarketTradeState, action: PayloadAction<Array<MarketTradeType>>) => {
        state.trades = [...state.trades, ...action.payload]

        if (state.trades.length > 25) {
            const spliceAmount = state.trades.length - 25
            state.trades = state.trades.slice(spliceAmount)
        }

        return state
    }
}

const marketTradeSlice = createSlice({
    name: 'marketTrades',
    initialState,
    reducers: marketTradesReducer
})

export const { addTrades } = marketTradeSlice.actions 

export default marketTradeSlice.reducer
