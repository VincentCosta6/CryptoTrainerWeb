import { useState, useEffect } from 'react'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import LeveragedTrade from './LeveragedTrade'
import OpenTradeView from './OpenTradeView'

import { LeveragedTradeType, removeLeveragedTrade } from '../redux/reducers/leveragedTrade';
import { addTrade } from '../redux/reducers/trades';
import { setDollars } from '../redux/reducers/user';

import { useAppDispatch } from '../redux/store'
import { useLeveragedTrades } from '../redux/selectors/leveragedtradesSelectors';
import { useCoinMap, useSelectedCoin } from '../redux/selectors/coinSelectors';
import { useLastPrice } from '../redux/selectors/priceSelectors';
import { useUserUUID } from '../redux/selectors/userSelectors';

import './OpenTrades.scss'

export const OpenTrades = () => {
    const dispatch = useAppDispatch()

    const uuid = useUserUUID()

    const historicalLeveragedTrades = useLeveragedTrades()
    const coinMap = useCoinMap()

    const selectedCrypto = useSelectedCoin()
    const lastPrice = useLastPrice()

    const [page, setPage] = useState(0)
    const [tradeChosen, setTradeChosen] = useState<LeveragedTradeType | null>(null)
    const [executionLoading, setExecutionLoading] = useState(false)
    const [leveragedTrades, setLeveragedTrades] = useState<any>(() => historicalLeveragedTrades.filter((trade: LeveragedTradeType) => trade.tradeOpen && trade.ticker === selectedCrypto))

    const handleExecution = () => {
        setExecutionLoading(true)
        fetch(`https://api.minecraftmarkets.com/leverage/sell/${coinMap[selectedCrypto].exchange}/${selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            // @ts-ignore
            body: JSON.stringify({ uuid: uuid, priceAtExecution: lastPrice, tradeID: tradeChosen?._id })
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

    const length = historicalLeveragedTrades.filter((trade: LeveragedTradeType) => trade.tradeOpen && trade.ticker === selectedCrypto).length

    useEffect(() => {
        setLeveragedTrades(historicalLeveragedTrades.filter((trade: LeveragedTradeType) => trade.tradeOpen && trade.ticker === selectedCrypto))
    }, [historicalLeveragedTrades])

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
                        {historicalLeveragedTrades.filter((trade: LeveragedTradeType) => trade.tradeOpen && trade.ticker === selectedCrypto).slice(page * 11, page * 11 + 11).map((trade: LeveragedTradeType) => (
                            <LeveragedTrade trade={trade} price={lastPrice} onClick={() => setTradeChosen(trade)} />
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

export default OpenTrades
