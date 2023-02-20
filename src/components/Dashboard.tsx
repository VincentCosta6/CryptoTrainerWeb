
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

import ChartContainer from './ChartContainer'
import LeftPanel from './LeftPanel'
import LeveragedTrade from './LeveragedTrade'
import MarketTrade from './MarketTrade';
import { MarketTradeType } from '../redux/reducers/marketTrades';

import { removeLiquidations } from '../redux/reducers/liquidations'

import { useAppDispatch } from '../redux/store'
import { useUserLoading } from '../redux/selectors/userSelectors'
import { useCoinsLoading, useSelectedCoin } from '../redux/selectors/coinSelectors'
import { useLiquidations } from '../redux/selectors/liquidationsSelectors'
import { useMarketTrades } from '../redux/selectors/marketTradesSelectors'

import { numberWithCommasAndRounded, tickerMap } from './BalanceContainer'

const Dashboard = () => {
    const userLoading = useUserLoading()
    const coinsLoading = useCoinsLoading()

    if (userLoading !== 'success' || coinsLoading !== 'success') {
        return (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={80} />
            </div>
        )
    }

    return (
        <div style={{ height: '92vh' }}>
            <LiquidationNotice />
            <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ color: '#8a939f', borderRight: '1px solid #262d34', padding: 10, maxWidth: 350, minWidth: 350 }}>
                    <LeftPanel />
                </div>
                <div style={{ flexGrow: 1 }}>
                    <ChartContainer />
                </div>
                <MarketTradesView />
            </div>
        </div>
    )
}

const LiquidationNotice = () => {
    const dispatch = useAppDispatch()

    const liquidations = useLiquidations()

    return (
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
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', color: '#8a939e' }}>
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
}

const MarketTradesView = () => {
    const selectedCrypto = useSelectedCoin()
    const marketTrades = useMarketTrades()

    return (
        <div style={{ overflowY: 'hidden', color: '#8a939f', borderLeft: '1px solid #262d34', padding: 10, minWidth: 100, minHeight: '100%' }}>
            {
                [...marketTrades[selectedCrypto]].reverse().map((trade: MarketTradeType) => <MarketTrade key={trade.externalId} trade={trade} />)
            }
        </div>
    )
}

export default Dashboard
