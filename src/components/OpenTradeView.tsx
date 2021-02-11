import React, { useState, useEffect } from 'react'

import { RootState } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LeveragedTrade from './LeveragedTrade'
import { LeveragedTradeType } from '../redux/reducers/leveragedTrade';
import { getPriceWithProperZeroes, numberWithCommasAndRounded } from './BalanceContainer';

export const OpenTradeView = ({ trade, lastPrice }: Props) => {
    if (!trade) {
        return <p>loading</p>
    }

    const valueAtPurchase = Number(trade.leveragedBuyingPower)
    const currentValue = trade.quantity * Number(lastPrice)

    const leveragedChange = currentValue - valueAtPurchase

    const percentageIncrease = leveragedChange / Number(trade.initialMargin) * 100

    return (
        <div>
            <p>Trade Type: {trade.type}</p>
            <p>Trade Leverage: {trade.leverageTimes}x</p>
            <p>Initial Investment: {numberWithCommasAndRounded(Number(trade.initialMargin), 2)}</p>
            <p>Total starting power: ${numberWithCommasAndRounded(Number(trade.leveragedBuyingPower), 2)}</p>
            <p>Purchase Price: ${getPriceWithProperZeroes(Number(trade.executedPrice))}</p>
            <p>Total power: ${getPriceWithProperZeroes(currentValue)}</p>
            <p>Position Change: ${numberWithCommasAndRounded(leveragedChange, 2)}</p>
            <p style={{ color: percentageIncrease < 0 ? 'red' : 'green' }}>{percentageIncrease > 0 ? '+' : ''}{numberWithCommasAndRounded(percentageIncrease, 2)}%</p>
        </div>
    )
};

const mapStateToProps = (state: RootState) => ({
    lastPrice: state.price.lastPrice,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {
    trade: LeveragedTradeType | null
}

export default connector(OpenTradeView)