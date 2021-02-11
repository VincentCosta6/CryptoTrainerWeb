import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Coin {
    name: string,
    ticker: string,
    cryptowatchID: string
    exchange: string
}

interface CoinState {
    coins: Array<string>,
    selectedCoin: string,
    map: {
        [ticker: string]: Coin
    },
    loading: 'idle' | 'pending' | 'success' | 'error',
}

const initialState = {
    coins: [],
    selectedCoin: '',
    map: {},
    loading: 'idle',
} as CoinState

export const fetchCoinList = createAsyncThunk(
    'coins/fetchCoinList',
    async () => {
        const response = await (await fetch(`https://api.minecraftmarkets.com/coins?length=2`)).json();
        return response.data
    }
)

export const coinReducer = {
    setSelectedCoin: (state: CoinState, action: PayloadAction<string>) => ({ ...state, selectedCoin: action.payload }),
    setCoins: (state: CoinState, action: PayloadAction<Array<string>>) => ({ ...state, coins: action.payload })
}

const coinSlice = createSlice({
    name: 'coin',
    initialState,
    reducers: coinReducer,
    extraReducers: builder => {
        builder.addCase(fetchCoinList.pending, (state: CoinState, action) => ({ ...state, loading: 'pending' }))
        builder.addCase(fetchCoinList.fulfilled, (state: CoinState, action) => ({ ...action.payload, loading: 'success', selectedCoin: action.payload.coins[0] }))
        builder.addCase(fetchCoinList.rejected, (state: CoinState, action) => ({ ...state, loading: 'error' }))
    }
})

export const { setSelectedCoin, setCoins } = coinSlice.actions 

export default coinSlice.reducer
