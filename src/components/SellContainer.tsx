import React, { useState } from 'react'

import BalanceContainer, { getPriceWithProperZeroes, numberWithCommasAndRounded, tickerMap, toFixed } from './BalanceContainer'

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

export const TradingActionContainer = (props: Props) => {
    const dispatch = useAppDispatch()

    const [maxSell, setMaxSell] = useState(false)
    const [sellField, setSellField] = useState('')

    const handleSell = () => {
        props.setSellLoading(true)
        fetch(`https://api.minecraftmarkets.com/coins/sell/${props.coinMap[props.selectedCrypto].exchange}/${props.selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: maxSell ? props.coinBalance[props.selectedCrypto] : sellField, uuid: props.userUUID, priceAtExecution: props.lastPrice, max: maxSell })
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

    const price = getPriceWithProperZeroes(Number(props.lastPrice) * .99985)
    const fees = Number(sellField) * .003 * price

    const newMoney = Number(sellField) * Number(price) - fees

    const newBalance = Number(props.dollarBalance) + newMoney
    const remainingCoins =  maxSell ? 0 : Number(props.coinBalance[props.selectedCrypto] || 0) - Number(sellField)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #262d34' }}>
            <p style={{ color: '#8a939f' }}>Amount</p>
            <div style={{ display: 'flex', maxHeight: 50 }}>
                <Paper component="form" style={{ backgroundColor: "#263543", maxHeight: 50, height: 50, display: 'flex' }}>
                    <Button
                        style={{ backgroundColor: '#263543', height: 50, color: '#8a939f' }}
                        variant="text"
                        size="small"
                        onClick={() => {
                            setSellField(toFixed(Number(props.coinBalance[props.selectedCrypto] || 0), 6) + "")
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
                        size="small"
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
            <div style={{ marginTop: 10 }}>
                <div style={{ marginLeft: 7 }}>
                    <p style={{ marginTop: 0, marginLeft: 10 }}>Fees: ${numberWithCommasAndRounded(fees, 2)}</p>
                    <p style={{ marginTop: 0, marginLeft: 10 }}>New Balance: ${numberWithCommasAndRounded(newBalance, 2)} (+${numberWithCommasAndRounded(newMoney, 2)})</p>
                    <p style={{ marginTop: 0, marginLeft: 10 }}>Remaining: {numberWithCommasAndRounded(remainingCoins, 6)}</p>
                </div>
            </div>
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