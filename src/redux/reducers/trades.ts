import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Coin } from './coins';

interface Trade {
    ticker: string
    type: 'buy' | 'sell',
    quantity: number,
    requestedPrice: number,
    executedPrice: number
}

interface TradeState {
    trades: {
        [ticker: string]: Array<Trade>
    }
    loading: 'idle' | 'pending' | 'success' | 'error',
}

const initialState = {
    trades: {},
    loading: 'idle',
} as TradeState

interface FetchTradesPayload {
    uuid: string
    coins: Array<string> 
}

export const fetchTradeList = createAsyncThunk(
    'trades/fetchTradeList',
    async (payload: FetchTradesPayload) => {
        const response = await (await fetch(`https://api.minecraftmarkets.com/user/${payload.uuid}/trades`)).json();

        const defaultTradesObj = payload.coins.reduce((acc, coin: string) => {
            // @ts-ignore
            acc[coin] = []
            return acc
        }, {})

        return {
            ...defaultTradesObj,
            ...response.trades
        }
    }
)

export const tradesReducer = {
    addTrade: (state: TradeState, action: PayloadAction<Trade>) => {
        state.trades[action.payload.ticker].push(action.payload)
        return state
    }
}

const tradeSlice = createSlice({
    name: 'trades',
    initialState,
    reducers: tradesReducer,
    extraReducers: builder => {
        builder.addCase(fetchTradeList.pending, (state: TradeState, action) => ({ ...state, loading: 'pending' }))
        builder.addCase(fetchTradeList.fulfilled, (state: TradeState, action) => {
            const coinMap = action.payload.coinMap

            return { trades: action.payload, loading: 'success' }
        })
        builder.addCase(fetchTradeList.rejected, (state: TradeState, action) => ({ ...state, loading: 'error' }))
    }
})

export const { addTrade } = tradeSlice.actions 

export default tradeSlice.reducer
