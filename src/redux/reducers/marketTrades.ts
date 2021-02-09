import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StringMappingType } from 'typescript'

export interface MarketTradeType {
    externalId: string
    orderSide: 'SELLSIDE' | 'BUYSIDE'
    amountStr: string
    priceStr: string
}

interface MarketTradeState {
    trades: {
        [ticker: string]: Array<MarketTradeType>
    }
}

const initialState = {
    trades: {
        btcusd: [],
        ethusd: [],
        dogeusdt: [],
    },
} as MarketTradeState

interface AddTradesPayload {
    ticker: string,
    trades: Array<MarketTradeType>
}

export const marketTradesReducer = {
    addTrades: (state: MarketTradeState, action: PayloadAction<AddTradesPayload>) => {
        state.trades[action.payload.ticker] = [...state.trades[action.payload.ticker], ...action.payload.trades]

        if (state.trades[action.payload.ticker].length > 25) {
            const spliceAmount = state.trades[action.payload.ticker].length - 25
            state.trades[action.payload.ticker] = state.trades[action.payload.ticker].slice(spliceAmount)
        }

        return state
    },
    clearTrades: (state: MarketTradeState, action: PayloadAction<string>) => {
        state.trades[action.payload] = []
        return state
    }
}

const marketTradeSlice = createSlice({
    name: 'marketTrades',
    initialState,
    reducers: marketTradesReducer
})

export const { addTrades, clearTrades } = marketTradeSlice.actions 

export default marketTradeSlice.reducer
