import React, { useState } from 'react'

import BalanceContainer from './BalanceContainer'

import { RootState, useAppDispatch } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'

import { setDollars } from '../redux/reducers/user'
import { setCoinQuantity } from '../redux/reducers/usersCoins'
import { addTrade } from '../redux/reducers/trades'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import InputBase from '@material-ui/core/InputBase'
import CircularProgress from '@material-ui/core/CircularProgress'

function toFixed(num: any, fixed: number) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function numberWithCommasAndRounded(x: any, length: number) {
    const fixed = toFixed(x, length)
    return fixed.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

const nameMap: any = {
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum',
}

export const TradingActionContainer = (props: Props) => {
    const dispatch = useAppDispatch()

    const [maxSell, setMaxSell] = useState(false)
    const [sellField, setSellField] = useState('')

    const handleSell = () => {
        props.setSellLoading(true)
        fetch(`https://minecraft-markets.herokuapp.com/coins/sell/${props.selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: maxSell ? props.coinBalance[props.selectedCrypto] : sellField, uuid: props.userUUID, priceAtExecution: props.lastPrice })
        })
            .then(res => res.json())
            .then(data => {
                const updateInfo = data.data
                dispatch(setCoinQuantity({
                    ticker: props.selectedCrypto,
                    quantity: updateInfo.newCoinAmount
                }))
                dispatch(addTrade(updateInfo.trade))
                dispatch(setDollars(updateInfo.newDollars))
                props.setSellLoading(false)
                setSellField('0')
                setMaxSell(false)
            })
            .catch(err => {
                console.log(err)
                props.setSellLoading(false)
                setMaxSell(false)
            })
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ color: '#8a939f' }}>Amount</p>
            <div style={{ display: 'flex', maxHeight: 50 }}>
                <Paper component="form" style={{ backgroundColor: "#263543", maxHeight: 50, height: 50 }}>
                    <Button
                        style={{ backgroundColor: '#263543', height: 50, color: '#8a939f' }}
                        variant="text"
                        onClick={() => {
                            setSellField(toFixed(Number(props.coinBalance[props.selectedCrypto]), 6) + "")
                            setMaxSell(true)
                        }}
                    >
                        Max
                                        </Button>
                    <InputBase
                        placeholder="0.00"
                        inputProps={{ 'aria-label': 'search google maps' }}
                        value={sellField}
                        style={{
                            backgroundColor: '#263543',
                            color: 'white',
                            marginLeft: 10,
                        }}
                        onChange={event => {
                            setSellField(event.target.value)
                            setMaxSell(false)
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSell}
                        disabled={props.sellLoading || props.otherActionLoading}
                        style={{
                            backgroundColor: '#f9672d',
                            color: 'white',
                            height: 50
                        }}
                    >
                        {
                            props.sellLoading ? (
                                <CircularProgress size={15} />
                            ) : 'SELL'
                        }
                    </Button>
                </Paper>
            </div>
            {
                sellField && (
                    <div>
                        <h2>Details</h2>
                        <div style={{ marginLeft: 7 }}>
                            <div>
                                <h2 style={{ marginBottom: 3 }}>USD</h2>
                                <p style={{ marginTop: 0, marginLeft: 10 }}>+ ${numberWithCommasAndRounded(Number(Number(sellField) * props.lastPrice), 2)}</p>
                                <p style={{ marginTop: 0, marginLeft: 10 }}>New Balance: ${numberWithCommasAndRounded(Number(Number(sellField) * props.lastPrice + props.dollarBalance), 2)}</p>
                            </div>
                            <div>
                                <h2 style={{ marginBottom: 3 }}>Remaining {nameMap[props.coinMap[props.selectedCrypto].name]}</h2>
                                <p style={{ marginTop: 0, marginLeft: 10 }}>{numberWithCommasAndRounded(Number(props.coinBalance[props.selectedCrypto] - Number(sellField)), 6)}</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
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
    otherActionLoading: boolean
    sellLoading: boolean
    setSellLoading: Function
}

export default connector(TradingActionContainer)