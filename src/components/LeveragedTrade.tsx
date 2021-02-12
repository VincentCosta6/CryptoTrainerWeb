import React from 'react'
import { LeveragedTradeType } from '../redux/reducers/leveragedTrade'
import { MarketTradeType } from '../redux/reducers/marketTrades'
import { numberWithCommasAndRounded, tickerMap } from './BalanceContainer'

const upColor = '#47b262'
const downColor = '#eb5454'

export default ({ trade, price }: { trade: LeveragedTradeType, price: number }) => {
    const valueAtPurchase = Number(trade.leveragedBuyingPower)
    const currentValue = trade.quantity * Number(price)

    const leveragedChange = currentValue - valueAtPurchase

    const percentageIncrease = leveragedChange / Number(trade.initialMargin) * 100

    return (
        <div style = {{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ color: trade.type === 'BUY' ? 'green' : 'red' }}>{trade.type} {trade.leverageTimes}x</p>
            <p>${numberWithCommasAndRounded(Number(trade.initialMargin), 2)}</p>
            <p style={{ color: leveragedChange < 0 ? 'red' : 'green' }}>{leveragedChange > 0 ? '+' : ''}{numberWithCommasAndRounded(leveragedChange, 2)}</p>
            <p style={{ color: percentageIncrease < 0 ? 'red' : 'green' }}>{percentageIncrease > 0 ? '+' : ''}{numberWithCommasAndRounded(percentageIncrease, 2)}%</p>
        </div>
    )
}