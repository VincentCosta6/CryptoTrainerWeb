import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface PriceKey {
    [interval: string]: Array<ApexCandle>
}

export const timeIntervalsList = [
    {value: '60', name: '1M'}, 
    {value: '300', name: '5M'}, 
    {value: '900', name: '15M'}, 
    {value: '3600', name: '1H'}, 
    {value: '14400', name: '4H'}, 
    {value: '86400', name: '1D'}, 
]
export const timeIntervalsArr = timeIntervalsList.map(interval => interval.value)

type TimeIntervals = '300' | '900' | '3600'
type ConnectionStatus = 'idle' | 'pending' | 'success' | 'error'

interface PriceState {
    prices: {
        [ticker: string]: PriceKey
    }
    lastPrice: number
    selectedInterval: TimeIntervals
    subscriptions: Array<string>
    websocket: WebSocket | null
    websocketConnected: ConnectionStatus 
    loading: ConnectionStatus
}

const initialState = {
    prices: {},
    lastPrice: 38000,
    selectedInterval: '300',
    subscriptions: [],
    websocket: null,
    websocketConnected: 'idle',
    loading: 'idle',
} as PriceState

interface FetchCoinPriceParameters {
    ticker: string
    exchange: string
    interval: string
    coins: Array<string>
}

export const fetchCoinPrice = createAsyncThunk(
    'price/fetchCoinPrice',
    async (params: FetchCoinPriceParameters) => {
        const response = await (await fetch(`https://api.cryptotrainer.us/price/${params.exchange}/${params.ticker}?interval=${params.interval}`)).json();

        return {
            result: response.result,
            ticker: params.ticker,
            intervalName: params.interval,
            coins: params.coins,
        }
    }
)

export interface ApexCandle {
    x: number
    y: Array<number>,
    z: Array<number>
}

interface SetCandlePayload {
    ticker: string
    intervalName: string
    y: Array<number>
    z: Array<number>
}

interface AddCandlePayload {
    ticker: string
    intervalName: string
    interval: ApexCandle
}

export const priceReducers = {
    addCandle: (state: PriceState, action: PayloadAction<AddCandlePayload>) => {
        state.prices[action.payload.ticker][action.payload.intervalName].push(action.payload.interval)
    },
    setCandle: (state: PriceState, action: PayloadAction<SetCandlePayload>) => {
        const currentCandleArr = state.prices[action.payload.ticker][action.payload.intervalName]

        state.prices[action.payload.ticker][action.payload.intervalName][currentCandleArr.length - 1].y = action.payload.y
        state.prices[action.payload.ticker][action.payload.intervalName][currentCandleArr.length - 1].z = action.payload.z
    },
    setLastPrice: (state: PriceState, action: PayloadAction<number>) => {
        state.lastPrice = action.payload
    },
    setTimeInterval: (state: PriceState, action: PayloadAction<TimeIntervals>) => {
        state.selectedInterval = action.payload
    },
    setSubscriptions: (state: PriceState, action: PayloadAction<Array<string>>) => {
        state.subscriptions = action.payload
    },
    addSubscription: (state: PriceState, action: PayloadAction<string>) => {
        state.subscriptions.push(action.payload)
    },
    removeSubscription: (state: PriceState, action: PayloadAction<string>) => {
        const index = state.subscriptions.indexOf(action.payload)

        if (index !== -1) {
            state.subscriptions.splice(index, 1)
        }
    },
    setWebsocket: (state: PriceState, action: PayloadAction<WebSocket>) => {
        state.websocket = action.payload
    },
    setWebsocketStatus: (state: PriceState, action: PayloadAction<ConnectionStatus>) => {
        state.websocketConnected = action.payload
    },

}

const priceSlice = createSlice({
    name: 'price',
    initialState,
    reducers: priceReducers,
    extraReducers: builder => {
        builder.addCase(fetchCoinPrice.pending, (state: PriceState, action) => ({ ...state, loading: 'pending' }))
        builder.addCase(fetchCoinPrice.fulfilled, (state: PriceState, action) => {
            /*x: new Date(candle[0] * 1000),
                y: [candle[1], candle[2], candle[3], candle[4]]*/

            const candleSticks = action.payload.result[action.payload.intervalName].map((arr: any) => ({
                x: arr[0] * 1000,
                y: [arr[1], arr[2], arr[3], arr[4]],
                z: [arr[5], arr[6]]
            }))

            const coins = action.payload.coins
            const intervalsObj = timeIntervalsArr.reduce((acc: { [interval: string]: Array<any> }, interval: string) => {
                acc[interval] = []
                return acc
            }, {})

            const pricesObj = coins.reduce((acc: { [ticker: string]: any }, coin: string) => {
                const copy = JSON.parse(JSON.stringify(intervalsObj))
                acc[coin] = copy
                return acc
            }, {})

            state.prices = pricesObj
            
            state.prices[action.payload.ticker][action.payload.intervalName] = candleSticks

            state.loading = 'success'
            return state
        })
        builder.addCase(fetchCoinPrice.rejected, (state: PriceState, action) => ({ ...state, loading: 'error' }))
    }
})

export const { addCandle, setCandle, setLastPrice, setSubscriptions, addSubscription, removeSubscription, setWebsocketStatus, setTimeInterval, setWebsocket } = priceSlice.actions 

export default priceSlice.reducer