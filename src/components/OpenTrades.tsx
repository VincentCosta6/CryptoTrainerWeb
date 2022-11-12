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

import './OpenTrades.scss'
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { addTrade } from '../redux/reducers/trades';

export const OpenTrades = (props: Props) => {
    const dispatch = useAppDispatch()

    const [page, setPage] = useState(0)
    const [tradeChosen, setTradeChosen] = useState<LeveragedTradeType | null>(null)
    const [executionLoading, setExecutionLoading] = useState(false)
    const [leveragedTrades, setLeveragedTrades] = useState<any>(props.leveragedTrades.filter((trade: LeveragedTradeType) => trade.tradeOpen && trade.ticker === props.selectedCrypto))

    const handleExecution = () => {
        setExecutionLoading(true)
        fetch(`https://api.minecraftmarkets.com/leverage/sell/${props.coinMap[props.selectedCrypto].exchange}/${props.selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            // @ts-ignore
            body: JSON.stringify({ uuid: props.uuid, priceAtExecution: props.lastPrice, tradeID: tradeChosen?._id })
        })
            .then(res => res.json())
            .then(data => {
                const updateInfo = data.data

                setExecutionLoading(false)
                // @ts-ignore
                dispatch(removeLeveragedTrade(tradeChosen))
                dispatch(addTrade(updateInfo.newTrade))
                dispatch(setDollars(updateInfo.newDollars))
                setTradeChosen(null)
            })
            .catch(err => {
                setExecutionLoading(false)
                console.log(err)
            })
    }

    const length = props.leveragedTrades.filter((trade: LeveragedTradeType) => trade.tradeOpen && trade.ticker === props.selectedCrypto).length

    useEffect(() => {
        setLeveragedTrades(props.leveragedTrades.filter((trade: LeveragedTradeType) => trade.tradeOpen && trade.ticker === props.selectedCrypto))
    }, [props.leveragedTrades])

    useEffect(() => {
        if (page * 11 >= leveragedTrades.length) {
            const lastIndex = Math.floor(leveragedTrades.length / 11)
            setPage(lastIndex)
        }
    }, [leveragedTrades.length])

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
                        {props.leveragedTrades.filter((trade: LeveragedTradeType) => trade.tradeOpen && trade.ticker === props.selectedCrypto).slice(page * 11, page * 11 + 11).map((trade: LeveragedTradeType) => (
                            <LeveragedTrade trade={trade} price={props.lastPrice} onClick={() => setTradeChosen(trade)} />
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
                            onPageChange={(event, newPage) => setPage(newPage)}
                            style={{  }}
                        />
                    )
                }
            </Paper>
            <Dialog
                open={Boolean(tradeChosen)}
                onClose={() => {
                    if (!executionLoading)
                        setTradeChosen(null)
                }}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                style={{ color: '#8a939e' }}
            >
                <DialogTitle id="simple-dialog-title" style={{ backgroundColor: '#262d34', color: '#8a939e' }}>Leveraged Trade View</DialogTitle>
                <DialogContent style={{ backgroundColor: '#262d34' }}>
                    <OpenTradeView trade={tradeChosen} />
                </DialogContent>
                <DialogActions style={{ backgroundColor: '#262d34' }}>
                    <Button onClick={() => {
                        if (!executionLoading)
                            setTradeChosen(null)
                    }} color="primary">
                        Back
                    </Button>
                    <Button onClick={handleExecution} color="primary" autoFocus disabled={executionLoading || !tradeChosen}>
                        Close Position
                    </Button>
                </DialogActions>
            </Dialog >
        </div>
    )
};

const mapStateToProps = (state: RootState) => ({
    coinMap: state.coins.map,
    uuid: state.user.uuid,
    lastPrice: state.price.lastPrice,
    leveragedTrades: state.leveragedTrades.leveragedTrades,
    leverageLoading: state.leveragedTrades.loading,
    selectedCrypto: state.coins.selectedCoin,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(OpenTrades)