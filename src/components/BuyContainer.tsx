import React, { useState } from 'react'

import { RootState, useAppDispatch } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'

import { setDollars } from '../redux/reducers/user'
import { setCoinQuantity } from '../redux/reducers/usersCoins'
import { addTrade } from '../redux/reducers/trades'
import { addLeveragedTrade } from '../redux/reducers/leveragedTrade'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import InputBase from '@material-ui/core/InputBase'
import CircularProgress from '@material-ui/core/CircularProgress'
import { getPriceWithProperZeroes, numberWithCommasAndRounded, tickerMap } from './BalanceContainer'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'

const leverageMap = {
    5: 5,
    6: 10,
    7: 25,
    8: 50,
    9: 100,
    10: 150,
}

export const BuyContainer = (props: Props) => {
    const dispatch = useAppDispatch()

    const [useLeverage, setUseLeverage] = useState(false)
    const [leverage, setLeverage] = useState<number>(5)
    const [maxBuy, setMaxBuy] = useState(false)
    const [buyField, setBuyField] = useState('')

    const handleBuy = () => {
        props.setBuyLoading(true)
        fetch(`https://api.minecraftmarkets.com/coins/buy/${props.coinMap[props.selectedCrypto].exchange}/${props.selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dollars: maxBuy ? props.dollarBalance : buyField, uuid: props.userUUID, priceAtExecution: props.lastPrice, max: maxBuy })
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
                props.setBuyLoading(false)
                setMaxBuy(false)
            })
    }

    const handleLeveragedBuy = () => {
        props.setBuyLoading(true)
        fetch(`https://api.minecraftmarkets.com/leverage/buy/${props.coinMap[props.selectedCrypto].exchange}/${props.selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            // @ts-ignore
            body: JSON.stringify({ initialMargin: maxBuy ? props.dollarBalance : buyField, leverageTimes: leverageMap[leverage], uuid: props.userUUID, priceAtExecution: props.lastPrice, max: maxBuy })
        })
            .then(res => res.json())
            .then(data => {
                const updateInfo = data.data
                dispatch(addLeveragedTrade(updateInfo.trade))
                dispatch(setDollars(updateInfo.newDollars))
                props.setBuyLoading(false)
                setBuyField('0')
                setMaxBuy(false)
            })
            .catch(err => {
                props.setBuyLoading(false)
                setMaxBuy(false)
            })
    }

    const price = getPriceWithProperZeroes(Number(props.lastPrice))
    const fees = Number(buyField) * .003

    const actualBuyingPower = Number(buyField) - fees
    // @ts-ignore
    const leveragedBuyingPower = actualBuyingPower * leverageMap[leverage]

    const newCoins = useLeverage ? Number(leveragedBuyingPower) / Number(price) : Number(actualBuyingPower) / Number(price)

    const newCoinBalance = Number(props.coinBalance[props.selectedCrypto] || 0) + newCoins
    const remainingBalance = maxBuy ? 0 : props.dollarBalance - Number(buyField)

    /*const newBalance = Number(props.dollarBalance) + newMoney
    const remainingCoins =  maxSell ? 0 : Number(props.coinBalance[props.selectedCrypto]) - Number(sellField)*/

    return (
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #262d34' }}>
            <FormControlLabel
                style={{ marginTop: 15 }}
                control={
                    <Checkbox
                        checked={useLeverage}
                        onChange={(event: any) => setUseLeverage(event.target.checked)}
                        name="checkedB"
                        color="primary"
                        style = {{ color: '#2eae34' }}
                    />
                }
                label="Leverage"
            />
            {
                useLeverage && (
                    <div>
                        <div style = {{ display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingLeft: 15, paddingRight: 15 }}>
                            <Slider
                                style = {{ color: '#2eae34' }}
                                value={leverage}
                                min={5}
                                step={1}
                                max={10}
                                marks={[
                                    { value: 5, label: '5x' },
                                    { value: 6, label: '10x' },
                                    { value: 7, label: '25x' },
                                    { value: 8, label: '50x' },
                                    { value: 9, label: '100x' },
                                    { value: 10, label: '150x' },
                                ]}
                                onChange={(event, newVal: any) => setLeverage(newVal)}
                                valueLabelDisplay="auto"
                                aria-labelledby="non-linear-slider"
                            />
                        </div>
                    </div>
                )
            }
            <div style = {{ display: 'flex', alignItems: 'center' }}>
                <p style={{ color: '#8a939f', marginRight: 10 }}>Amount</p>
                <Button
                    style={{ height: 25, color: '#8a939f', marginLeft: 5, border: '2px dashed #263543', flexGrow: 1 }}
                    variant="text"
                    size="small"
                    onClick={() => {
                        setBuyField((props.dollarBalance / 4 || 0) + "")
                        setMaxBuy(false)
                    }}
                >
                    25%
                </Button>
                <Button
                    style={{ height: 25, color: '#8a939f', marginLeft: 5, border: '2px dashed #263543', flexGrow: 1 }}
                    variant="text"
                    size="small"
                    onClick={() => {
                        setBuyField((props.dollarBalance / 2 || 0) + "")
                        setMaxBuy(false)
                    }}
                >
                    50%
                </Button>
                <Button
                    style={{ height: 25, color: '#8a939f', marginLeft: 5, border: '2px dashed #263543', flexGrow: 1 }}
                    variant="text"
                    size="small"
                    onClick={() => {
                        setBuyField((props.dollarBalance / 4 * 3 || 0) + "")
                        setMaxBuy(false)
                    }}
                >
                    75%
                </Button>
                <Button
                    style={{ height: 25, color: '#8a939f', marginLeft: 5, border: '2px dashed #263543', flexGrow: 1 }}
                    variant="text"
                    size="small"
                    onClick={() => {
                        setBuyField((props.dollarBalance || 0) + "")
                        setMaxBuy(true)
                    }}
                >
                    100%
                </Button>
            </div>
            <div style={{ display: 'flex', maxHeight: 50 }}>
                <Paper component="form" style={{ backgroundColor: "#263543", maxHeight: 50, height: 50, display: 'flex', width: '100%' }} variant="outlined">
                    <InputBase
                        placeholder="0.00"
                        inputProps={{ 'aria-label': 'search google maps' }}
                        value={buyField}
                        style={{
                            backgroundColor: '#263543',
                            color: 'white',
                            marginLeft: 10,
                            flexGrow: 1
                        }}
                        onChange={event => {
                            setBuyField(event.target.value)
                            setMaxBuy(false)
                        }}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => useLeverage ? handleLeveragedBuy() : handleBuy()}
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
                    {
                        useLeverage && (
                            <p style={{ marginTop: 0, marginLeft: 10 }}>Leveraged buying power: ${numberWithCommasAndRounded(leveragedBuyingPower, 2)}</p>
                        )
                    }
                    <p style={{ marginTop: 0, marginLeft: 10 }}>Fees: ${numberWithCommasAndRounded(fees, 2)}</p>
                    {  !useLeverage && <p style={{ marginTop: 0, marginLeft: 10 }}>New Balance: {numberWithCommasAndRounded(newCoinBalance, 6)}</p> }
                    <p style={{ marginTop: 0, marginLeft: 10 }}>Remaining: ${numberWithCommasAndRounded(remainingBalance, 2)}</p>
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