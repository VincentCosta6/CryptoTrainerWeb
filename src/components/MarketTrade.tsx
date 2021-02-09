import React from 'react'
import { MarketTradeType } from '../redux/reducers/marketTrades'

const upColor = '#47b262'
const downColor = '#eb5454'

function toFixed(num: any, fixed: number) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function numberWithCommasAndRounded(x: any, length: number) {
    const fixed = toFixed(x, length)
    return fixed.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

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