import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface LeveragedTradeType {
    _id: string,
    playerUUID: string,
    ticker: string,
    type: 'BUY' | 'SHORT',
    tradeOpen: boolean,
    initialMargin: string,
    leverageTimes: number,
    leveragedBuyingPower: string,
    quantity: number,
    requestedPrice: number,
    executedPrice: number,
}

interface LeveragedTradeState {
    leveragedTrades: Array<LeveragedTradeType>,
    loading: 'idle' | 'pending' | 'success' | 'error',
}

const initialState = {
    leveragedTrades: [],
    loading: 'idle',
} as LeveragedTradeState

interface FetchLeveragedTradesPayload {
    uuid: string
    coins: Array<string> 
}

export const fetchLeveragedTradesList = createAsyncThunk(
    'leveragedTrades/fetchLeveragedTradeList',
    async (payload: FetchLeveragedTradesPayload) => {
        const response = await (await fetch(`https://api.minecraftmarkets.com/leverage/user/${payload.uuid}`)).json();

        return response.leveragedTrades
    }
)

export const leveragedTradesReducer = {
    addLeveragedTrade: (state: LeveragedTradeState, action: PayloadAction<LeveragedTradeType>) => {
        state.leveragedTrades.push(action.payload)
        return state
    },
    removeLeveragedTrade: (state: LeveragedTradeState, action: PayloadAction<LeveragedTradeType>) => {
        state.leveragedTrades = state.leveragedTrades.filter(trade => trade._id !== action.payload._id)
        return state
    },
}

const leveragedTradesSlice = createSlice({
    name: 'leveragedTrades',
    initialState,
    reducers: leveragedTradesReducer,
    extraReducers: builder => {
        builder.addCase(fetchLeveragedTradesList.pending, (state: LeveragedTradeState, action) => ({ ...state, loading: 'pending' }))
        builder.addCase(fetchLeveragedTradesList.fulfilled, (state: LeveragedTradeState, action) => {
            return { leveragedTrades: action.payload, loading: 'success' }
        })
        builder.addCase(fetchLeveragedTradesList.rejected, (state: LeveragedTradeState, action) => ({ ...state, loading: 'error' }))
    }
})

export const { addLeveragedTrade, removeLeveragedTrade } = leveragedTradesSlice.actions 

export default leveragedTradesSlice.reducer
