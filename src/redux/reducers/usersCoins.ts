import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface UsersCoinsState {
    tickers: {
        [ticker: string]: number
    }
    loading: 'idle' | 'pending' | 'success' | 'error'
}

const initialState = {
    tickers: {},
    loading: 'idle',
} as UsersCoinsState

export const fetchUsersCoinsByUUID = createAsyncThunk(
    'users/fetchUsersCoinsByUUID',
    async (uuid: string) => {
        const response = await (await fetch(`https://minecraft-markets.herokuapp.com/users/${uuid}/coins/`)).json();

        const tickers = response.coins.reduce((acc: any, coin: any) => {
            acc[coin.coinTicker] = coin.quantity
            return acc
        }, {})

        return tickers
    }
)

interface AddCoinQuantityPayload {
    ticker: string
    quantity: number
}

export const usersCoinsReducer = {
    addCoinQuantity: (state: UsersCoinsState, action: PayloadAction<AddCoinQuantityPayload>) => {
        state.tickers[action.payload.ticker] += action.payload.quantity
    },
    sellCoinQuantity: (state: UsersCoinsState, action: PayloadAction<AddCoinQuantityPayload>) => {
        state.tickers[action.payload.ticker] -= action.payload.quantity
    },
    setCoinQuantity: (state: UsersCoinsState, action: PayloadAction<AddCoinQuantityPayload>) => {
        state.tickers[action.payload.ticker] = action.payload.quantity
    },
}

const usersCoinsSlice = createSlice({
    name: 'usersCoins',
    initialState,
    reducers: usersCoinsReducer,
    extraReducers: builder => {
        builder.addCase(fetchUsersCoinsByUUID.pending, (state: UsersCoinsState, action) => ({ ...state, loading: 'pending' }))
        builder.addCase(fetchUsersCoinsByUUID.fulfilled, (state: UsersCoinsState, action) => ({ tickers: action.payload, loading: 'success' }))
        builder.addCase(fetchUsersCoinsByUUID.rejected, (state: UsersCoinsState, action) => ({ ...state, loading: 'error' }))
    }
})

export const { addCoinQuantity, sellCoinQuantity, setCoinQuantity } = usersCoinsSlice.actions 

export default usersCoinsSlice.reducer
