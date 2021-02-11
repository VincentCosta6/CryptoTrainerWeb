import { combineReducers } from '@reduxjs/toolkit'

import coinReducer from './coins'
import userReducer from './user'
import usersCoinsReducer from './usersCoins'
import priceReducer from './price'
import tradesReducer from './trades'
import marketTradesReducer from './marketTrades'
import leveragedTradeReducer from './leveragedTrade'

export default combineReducers({
    coins: coinReducer,
    user: userReducer,
    usersCoins: usersCoinsReducer,
    price: priceReducer,
    trades: tradesReducer,
    marketTrades: marketTradesReducer,
    leveragedTrades: leveragedTradeReducer,
})