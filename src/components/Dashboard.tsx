import React from 'react'

import LeftPanel from './LeftPanel'
import ChartContainer from './ChartContainer'

import { RootState } from '../redux/store'

import { connect, ConnectedProps } from 'react-redux'
import { useAppDispatch } from '../redux/store'
import { CircularProgress } from '@material-ui/core'
import { MarketTradeType } from '../redux/reducers/marketTrades';
import MarketTrade from './MarketTrade';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import { removeLiquidations } from '../redux/reducers/liquidations'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import LeveragedTrade from './LeveragedTrade'
import { numberWithCommasAndRounded, tickerMap } from './BalanceContainer'

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
        <div style={{ height: '92vh' }}>
            <LiquidationNotice  dispatch={dispatch} liquidations={props.liquidations} lastPrice={props.lastPrice}  />
            <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ color: '#8a939f', borderRight: '1px solid #262d34', padding: 10, maxWidth: 350, minWidth: 350 }}>
                    <LeftPanel />
                </div>
                <div style={{ flexGrow: 1 }}>
                    <ChartContainer />
                </div>
                <div style={{ overflowY: 'hidden', color: '#8a939f', borderLeft: '1px solid #262d34', padding: 10, minWidth: 100, minHeight: '100%' }}>
                    {
                        [...props.marketTrades[props.selectedCrypto]].reverse().map((trade: MarketTradeType) => <MarketTrade key={trade.externalId} trade={trade} />)
                    }
                </div>
            </div>
        </div>
    )
}

const LiquidationNotice = ({ liquidations, dispatch, lastPrice }: { liquidations: any, dispatch: any, lastPrice: number }) => (
    <Dialog
        open={liquidations.length > 0}
        // @ts-ignore
        onClose={() => dispatch(removeLiquidations())}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ color: '#8a939e' }}
    >
        <DialogTitle id="alert-dialog-title" style={{ backgroundColor: '#262d34', color: '#8a939e' }}>{liquidations.length === 1 ? 'Your position was liquidated' : 'Your positions were liquidated'}</DialogTitle>
        <DialogContent style={{ backgroundColor: '#262d34' }}>
            <List component="nav" aria-label="main mailbox folders">
                {
                    // @ts-ignore
                    liquidations.map((trade: LeveragedTradeType) => (
                        <ListItem button key={trade._id}>
                            <div style = {{ width: '100%', display: 'flex', justifyContent: 'space-between', color: '#8a939e' }}>
                                <p>{tickerMap[trade.ticker]}</p>
                                <div style={{ display: 'flex', marginBottom: 0 }}>
                                    <p style={{ color: trade.type === 'BUY' ? 'green' : 'red' }}> {trade.type}</p>
                                </div>
                                <p>{trade.leverageTimes}x</p>
                                <p>$ {numberWithCommasAndRounded(Number(trade.initialMargin), 2)}</p>
                            </div>
                        </ListItem>
                    ))
                }
            </List>
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#262d34' }}>
            { /* @ts-ignore */}
            <Button onClick={() => dispatch(removeLiquidations())} color="primary">
                Close
            </Button>
        </DialogActions>
    </Dialog>
)

const mapStateToProps = (state: RootState) => ({
    dollarBalance: state.user.dollars,
    candlesLoading: state.price.loading,
    coinMap: state.coins.map,
    coinLoading: state.coins.loading,
    selectedCrypto: state.coins.selectedCoin,
    selectedInterval: state.price.selectedInterval,
    subscriptions: state.price.subscriptions,
    lastPrice: state.price.lastPrice,
    liquidations: state.liquidations.liquidations,
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