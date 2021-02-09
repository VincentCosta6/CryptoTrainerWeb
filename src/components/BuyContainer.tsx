import React, { useState } from 'react'

import { RootState, useAppDispatch } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'

import { setDollars } from '../redux/reducers/user'
import { setCoinQuantity } from '../redux/reducers/usersCoins'
import { addTrade } from '../redux/reducers/trades'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import InputBase from '@material-ui/core/InputBase'
import CircularProgress from '@material-ui/core/CircularProgress'
import { tickerMap } from './BalanceContainer'

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

export const BuyContainer = (props: Props) => {
    const dispatch = useAppDispatch()

    const [maxBuy, setMaxBuy] = useState(false)
    const [buyField, setBuyField] = useState('')

    const handleBuy = () => {
        props.setBuyLoading(true)
        fetch(`https://minecraft-markets.herokuapp.com/coins/buy/${props.selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dollars: maxBuy ? props.dollarBalance : buyField, uuid: props.userUUID, priceAtExecution: props.lastPrice })
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
                props.setBuyLoading(false)
                setBuyField('0')
                setMaxBuy(false)
            })
            .catch(err => {
                console.log(err)
                props.setBuyLoading(false)
                setMaxBuy(false)
            })
    }

    const price = Number(props.lastPrice) * 1.0005
    const fees = Number(buyField) * .01

    const actualBuyingPower = Number(buyField) - fees

    const newCoins = Number(actualBuyingPower) / Number(price)

    const newCoinBalance = Number(props.coinBalance[props.selectedCrypto]) + newCoins
    const remainingBalance = maxBuy ? 0 : props.dollarBalance - Number(buyField)

    /*const newBalance = Number(props.dollarBalance) + newMoney
    const remainingCoins =  maxSell ? 0 : Number(props.coinBalance[props.selectedCrypto]) - Number(sellField)*/

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
                            setBuyField(props.dollarBalance + "")
                            setMaxBuy(true)
                        }}
                    >
                        Max
                        </Button>
                    <InputBase
                        placeholder="0.00"
                        inputProps={{ 'aria-label': 'search google maps' }}
                        value={buyField}
                        style={{
                            backgroundColor: '#263543',
                            color: 'white',
                            marginLeft: 10,
                        }}
                        onChange={event => {
                            setBuyField(event.target.value)
                            setMaxBuy(false)
                        }}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleBuy}
                        disabled={props.buyLoading || props.otherActionLoading}
                        style={{
                            backgroundColor: '#2eae34',
                            color: 'white',
                            height: 50
                        }}
                    >
                        {
                            props.buyLoading ? (
                                <CircularProgress size={15} />
                            ) : 'BUY'
                        }
                    </Button>
                </Paper>
            </div>
            <div style={{ marginTop: 10 }}>
                <div style={{ marginLeft: 7 }}>
                    <p style={{ marginTop: 0, marginLeft: 10 }}>{tickerMap[props.selectedCrypto]}: ${numberWithCommasAndRounded(price, 2)}</p>
                    <p style={{ marginTop: 0, marginLeft: 10 }}>Fees: ${numberWithCommasAndRounded(fees, 2)}</p>
                    <p style={{ marginTop: 0, marginLeft: 10 }}>New Balance: {numberWithCommasAndRounded(newCoinBalance, 6)}</p>
                    <p style={{ marginTop: 0, marginLeft: 10 }}>Remaining ${numberWithCommasAndRounded(remainingBalance, 2)}</p>
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
    buyLoading: boolean
    setBuyLoading: Function
}

export default connector(BuyContainer)