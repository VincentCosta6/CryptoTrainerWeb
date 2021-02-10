import React from 'react'
import { MarketTradeType } from '../redux/reducers/marketTrades'
import { numberWithCommasAndRounded } from './BalanceContainer'

const upColor = '#47b262'
const downColor = '#eb5454'

export default ({ trade }: { trade: MarketTradeType }) => {
    const tradeAmount = Number(trade.amountStr)
    const priceAmount = Number(trade.priceStr)
    const totalPrice = numberWithCommasAndRounded(tradeAmount * priceAmount, 2)

    const tradeColor = trade.orderSide === 'BUYSIDE' ? upColor : downColor

    return (
        <div style = {{ display: 'flex', color: tradeColor }}>
            <p>${totalPrice}</p>
        </div>
    )
}