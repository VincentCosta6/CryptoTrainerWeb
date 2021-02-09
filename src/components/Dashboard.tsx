import React from 'react'

import LeftPanel from './LeftPanel'
import ChartContainer from './ChartContainer'

import { RootState } from '../redux/store'

import { connect, ConnectedProps } from 'react-redux'
import { useAppDispatch } from '../redux/store'
import { CircularProgress } from '@material-ui/core'
import { MarketTradeType } from '../redux/reducers/marketTrades';
import MarketTrade from './MarketTrade';

const Dashboard = (props: Props) => {
    const dispatch = useAppDispatch()

    if (props.userLoading !== 'success' || props.coinLoading !== 'success') {
        return (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={80} />
            </div>
        )
    }

    return (
        <div style={{ height: '90vh' }}>
            <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ color: '#8a939f', borderRight: '1px solid #262d34', padding: 10, minWidth: 300 }}>
                   <LeftPanel />
                </div>
                <div style={{ flexGrow: 1 }}>
                    <ChartContainer />
                </div>
                <div style = {{ overflowY: 'hidden', color: '#8a939f', borderLeft: '1px solid #262d34', padding: 10, minWidth: 100, minHeight: '100%' }}>
                    {
                        [...props.marketTrades[props.selectedCrypto]].reverse().map((trade: MarketTradeType) => <MarketTrade key={trade.externalId} trade={trade} />)
                    }
                </div>
            </div>
        </div>
    )
}

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
    marketTrades: state.marketTrades.trades
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(Dashboard)