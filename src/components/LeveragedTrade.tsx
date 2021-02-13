import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import React from 'react'
import { LeveragedTradeType } from '../redux/reducers/leveragedTrade'
import { MarketTradeType } from '../redux/reducers/marketTrades'
import { numberWithCommasAndRounded, tickerMap } from './BalanceContainer'

const upColor = '#47b262'
const downColor = '#eb5454'

function calculateNumeral(num: number) {
    let o = Intl.NumberFormat('en', { notation: 'compact' })

    let n = o.format(Number(num))

    return n
}

export default ({ trade, price, onClick }: { trade: LeveragedTradeType, price: number, onClick: Function }) => {
    const valueAtPurchase = Number(trade.leveragedBuyingPower)
    const currentValue = trade.quantity * Number(price)

    const leveragedChange = currentValue - valueAtPurchase

    const percentageIncrease = leveragedChange / Number(trade.initialMargin) * 100

    return (
        <TableRow>
            <TableCell component="th" scope="row" style={{ color: trade.type === 'BUY' ? 'green' : 'red' }} onClick={() => onClick(trade)}>
                {trade.type} {trade.leverageTimes}x
            </TableCell>
            <TableCell align="right" onClick={() => onClick(trade)} style={{ color: '#8a939f' }}>${calculateNumeral(Number(trade.initialMargin))}</TableCell>
            <TableCell align="right" style={{ color: leveragedChange < 0 ? 'red' : 'green', width: '25%' }} onClick={() => onClick(trade)}>{leveragedChange > 0 ? '+' : ''}{calculateNumeral(leveragedChange)}</TableCell>
            <TableCell align="right" style={{ color: percentageIncrease < 0 ? 'red' : 'green', width: '25%' }} onClick={() => onClick(trade)}>{percentageIncrease > 0 ? '+' : ''}{numberWithCommasAndRounded(percentageIncrease, 2)}%</TableCell>
        </TableRow>
    )
}