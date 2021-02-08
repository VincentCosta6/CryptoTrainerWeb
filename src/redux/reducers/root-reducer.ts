import { combineReducers } from '@reduxjs/toolkit'

import coinReducer from './coins'
import userReducer from './user'
import usersCoinsReducer from './usersCoins'
import priceReducer from './price'

export default combineReducers({
    coins: coinReducer,
    user: userReducer,
    usersCoins: usersCoinsReducer,
    price: priceReducer,
})