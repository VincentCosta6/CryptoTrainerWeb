import { createSlice, createAction, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
    username: string
    uuid: string
    dollars: number
    loading: 'idle' | 'pending' | 'success' | 'error'
}

const initialState = {
    username: '',
    uuid: '',
    dollars: 0,
    loading: 'idle',
} as UserState

export const fetchUserByUUID = createAsyncThunk(
    'users/fetchUsersByUUID',
    async (uuid: string) => {
        const response = await (await fetch(`https://minecraft-markets.herokuapp.com/user/${uuid}`)).json();
        return response.user
    }
)

export const userReducers = {
    setUsername: (state: UserState, action: PayloadAction<string>) => {
        state.username = action.payload
    },
    setDollars: (state: UserState, action: PayloadAction<number>) => {
        state.dollars = action.payload
    },
    subtractDollars: (state: UserState, action: PayloadAction<number>) => {
        state.dollars -= action.payload
    },
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: userReducers,
    extraReducers: builder => {
        builder.addCase(fetchUserByUUID.pending, (state: UserState, action) => ({ ...state, loading: 'pending' }))
        builder.addCase(fetchUserByUUID.fulfilled, (state: UserState, action) => ({ ...action.payload, loading: 'success' }))
        builder.addCase(fetchUserByUUID.rejected, (state: UserState, action) => ({ ...state, loading: 'error' }))
    }
})

export const { setUsername, setDollars, subtractDollars } = userSlice.actions 

export default userSlice.reducer
