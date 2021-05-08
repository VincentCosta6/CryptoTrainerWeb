import React, { useState, useEffect } from 'react'

import { RootState, useAppDispatch } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LeveragedTrade from './LeveragedTrade'
import OpenTradeView from './OpenTradeView'
import { LeveragedTradeType, removeLeveragedTrade } from '../redux/reducers/leveragedTrade';
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { upColor } from './chartOptions';
import { setDollars } from '../redux/reducers/user';
import DialogContentText from '@material-ui/core/DialogContentText';
import { removeLiquidations } from '../redux/reducers/liquidations';
import Divider from '@material-ui/core/Divider';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';

import './History.scss'
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { addTrade, Trade } from '../redux/reducers/trades';
import { MarketTradeType } from '../redux/reducers/marketTrades';
import { numberWithCommasAndRounded } from './BalanceContainer';

export const History = (props: Props) => {
    const dispatch = useAppDispatch()

    const [page, setPage] = useState(0)
    const [tradeChosen, setTradeChosen] = useState<Trade | null>(null)

    const currentTrades = props.trades[props.selectedCrypto].slice().reverse()
    const length = currentTrades.length

    return (
        <div>
            <Paper>
                <TableContainer style={{ height: '100%' }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow style={{ cursor: 'pointer', color: '#8a939f !important' }}>
                                <TableCell>Type</TableCell>
                                <TableCell align="right">Margin</TableCell>
                                <TableCell align="right">$</TableCell>
                                <TableCell align="right">%</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {currentTrades.slice(page * 11, page * 11 + 11).map((trade: Trade) => (
                            <TradeComp trade={trade} onClick={() => setTradeChosen(trade)} price={props.lastPrice} />
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    length > 11 && (
                        <TablePagination
                            rowsPerPageOptions={[5]}
                            component="div"
                            colSpan={3}
                            count={length}
                            rowsPerPage={11}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={(event, newPage) => setPage(newPage)}
                            style={{  }}
                        />
                    )
                }
            </Paper>
        </div>
    )
};

function calculateNumeral(num: number) {
    let o = Intl.NumberFormat('en', { notation: 'compact' })

    let n = o.format(Number(num))

    return n
}

export const TradeComp = ({ trade, onClick, price }: { trade: Trade, onClick: Function, price: Number }) => {
    const isLeveraged = Boolean(trade.leveragedTrade)
    const leveragedTrade = isLeveraged ? trade.leveragedTrade : null

    const initialInvestment = isLeveraged ? leveragedTrade?.initialMargin : trade.quantity * trade.executedPrice

    // @ts-ignore
    let leveragedChange = 0
    let percentageIncrease = 0

    if (isLeveraged) {
        // @ts-ignore
        leveragedChange = (leveragedTrade.salePrice * leveragedTrade?.quantity) - leveragedTrade.leveragedBuyingPower
        // @ts-ignore
        percentageIncrease = leveragedChange / Number(leveragedTrade.initialMargin) * 100
    } else {
        // @ts-ignore
        leveragedChange = (trade.executedPrice * trade.quantity) - (price * trade.quantity)
        // @ts-ignore
        percentageIncrease = leveragedChange / Number(trade.executedPrice * trade.quantity) * 100
    }

    return (
        <TableRow>
            <TableCell component="th" scope="row" style={{ color: trade.type === 'buy' ? 'green' : 'red' }} onClick={() => onClick(trade)}>
                { isLeveraged ? `${leveragedTrade?.type} ${leveragedTrade?.leverageTimes}x` : trade.type }
            </TableCell>
            <TableCell align="right" onClick={() => onClick(trade)} style={{ color: '#8a939f' }}>${calculateNumeral(Number(initialInvestment))}</TableCell>
            {
                isLeveraged ? (
                    <>
                        <TableCell align="right" style={{ color: leveragedChange < 0 ? 'red' : 'green', width: '25%' }} onClick={() => onClick(trade)}>{leveragedChange > 0 ? '+' : ''}{calculateNumeral(leveragedChange)}</TableCell>
                        <TableCell align="right" style={{ color: percentageIncrease < 0 ? 'red' : 'green', width: '25%' }} onClick={() => onClick(trade)}>{percentageIncrease > 0 ? '+' : ''}{numberWithCommasAndRounded(percentageIncrease, 2)}%</TableCell>
                    </>
                ) : (
                    <>
                        <TableCell align="right" style={{ color: leveragedChange < 0 ? 'red' : 'green', width: '25%' }} onClick={() => onClick(trade)}>{leveragedChange > 0 ? '+' : ''}{calculateNumeral(leveragedChange)}</TableCell>
                        <TableCell align="right" style={{ color: percentageIncrease < 0 ? 'red' : 'green', width: '25%' }} onClick={() => onClick(trade)}>{percentageIncrease > 0 ? '+' : ''}{numberWithCommasAndRounded(percentageIncrease, 2)}%</TableCell>
                    </>
                )
            }
            
        </TableRow>
    )
}

const mapStateToProps = (state: RootState) => ({
    coinMap: state.coins.map,
    uuid: state.user.uuid,
    lastPrice: state.price.lastPrice,
    trades: state.trades.trades,
    tradesLoading: state.trades.loading,
    selectedCrypto: state.coins.selectedCoin,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(History)