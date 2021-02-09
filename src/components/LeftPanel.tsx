import React from 'react'

import BalanceContainer from './BalanceContainer'
import TradingActionContainer from './TradingActionContainer'

import { RootState } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'


export const ChartContainer = (props: Props) => {

    return (
        <>
            <BalanceContainer />
            <TradingActionContainer />
        </>
    )
};

const mapStateToProps = (state: RootState) => ({
    dollarBalance: state.user.dollars,
    candlesLoading: state.price.loading,
    coinMap: state.coins.map,
    coinLoading: state.coins.loading,
    selectedCrypto: state.coins.selectedCoin,
    selectedInterval: state.price.selectedInterval,
    subscriptions: state.price.subscriptions,
    lastPrice: state.price.lastPrice,
    websocketConnected: state.price.websocketConnected,
    prices: state.price.prices,
    pricesLoading: state.price.loading,
    userLoading: state.user.loading,
    userUUID: state.user.uuid,
    coinBalance: state.usersCoins.tickers,
    marketTrades: state.marketTrades.trades,
    myTradesLoading: state.trades.loading,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(ChartContainer)