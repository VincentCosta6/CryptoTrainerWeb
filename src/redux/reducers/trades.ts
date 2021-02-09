import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

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
    trades: {
        'btcusd': []
    },
    loading: 'idle',
} as TradeState

export const fetchTradeList = createAsyncThunk(
    'trades/fetchTradeList',
    async (uuid: string) => {
        const response = await (await fetch(`https://minecraft-markets.herokuapp.com/user/${uuid}/trades`)).json();
        return response.trades
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
        builder.addCase(fetchTradeList.fulfilled, (state: TradeState, action) => ({ trades: action.payload, loading: 'success' }))
        builder.addCase(fetchTradeList.rejected, (state: TradeState, action) => ({ ...state, loading: 'error' }))
    }
})

export const { addTrade } = tradeSlice.actions 

export default tradeSlice.reducer
