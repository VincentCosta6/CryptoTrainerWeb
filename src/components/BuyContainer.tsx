import { FC, useState } from 'react'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputBase from '@material-ui/core/InputBase'
import Paper from '@material-ui/core/Paper'
import Slider from '@material-ui/core/Slider'

import { setDollars } from '../redux/reducers/user'
import { setCoinQuantity } from '../redux/reducers/usersCoins'
import { addTrade } from '../redux/reducers/trades'
import { addLeveragedTrade } from '../redux/reducers/leveragedTrade'

import { useAppDispatch } from '../redux/store'
import { useCoinMap, useSelectedCoin } from '../redux/selectors/coinSelectors'
import { useUserDollarBalance, useUserUUID } from '../redux/selectors/userSelectors'
import { useLastPrice } from '../redux/selectors/priceSelectors'
import { useUserCoinBalance } from '../redux/selectors/usersCoinsSelectors'

import { getPriceWithProperZeroes, numberWithCommasAndRounded } from './BalanceContainer'

const leverageMap = {
    5: 5,
    6: 10,
    7: 25,
    8: 50,
    9: 100,
    10: 150,
}

interface BuyContainerProps {
    otherActionLoading: boolean
    buyLoading: boolean
    setBuyLoading: Function
}
export const BuyContainer = (props: BuyContainerProps) => {
    const dispatch = useAppDispatch()

    const coinMap = useCoinMap()
    const selectedCrypto = useSelectedCoin()

    const dollarBalance = useUserDollarBalance()
    const userUUID = useUserUUID()

    const [useLeverage, setUseLeverage] = useState(false)
    const [leverage, setLeverage] = useState<number>(5)
    const [maxBuy, setMaxBuy] = useState(false)
    const [buyField, setBuyField] = useState('')

    const handleBuy = () => {
        props.setBuyLoading(true)
        fetch(`https://api.minecraftmarkets.com/coins/buy/${coinMap[selectedCrypto].exchange}/${selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dollars: maxBuy ? dollarBalance : buyField, uuid: userUUID, priceAtExecution: 0, max: maxBuy })
        })
            .then(res => res.json())
            .then(data => {
                const updateInfo = data.data
                dispatch(setCoinQuantity({
                    ticker: selectedCrypto,
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
        fetch(`https://api.minecraftmarkets.com/leverage/buy/${coinMap[selectedCrypto].exchange}/${selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            // @ts-ignore
            body: JSON.stringify({ initialMargin: maxBuy ? dollarBalance : buyField, leverageTimes: leverageMap[leverage], uuid: userUUID, priceAtExecution: 0, max: maxBuy })
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
            <div style = {{ display: 'flex', alignItems: 'center', marginTop: 15 }}>
                <p style={{ color: '#8a939f', marginRight: 10 }}>Amount</p>
                <Button
                    style={{ height: 25, color: '#8a939f', marginLeft: 5, border: '2px dashed #263543', flexGrow: 1 }}
                    variant="text"
                    size="small"
                    onClick={() => {
                        setBuyField((dollarBalance / 4 || 0) + "")
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
                        setBuyField((dollarBalance / 2 || 0) + "")
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
                        setBuyField((dollarBalance / 4 * 3 || 0) + "")
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
                        setBuyField((dollarBalance || 0) + "")
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
            <div style={{ marginTop: 25 }}>
                {
                    buyField !== '' && (
                        <NewBalanceContainer 
                            useLeverage={useLeverage}
                            buyField={buyField}
                            maxBuy={maxBuy}
                            leverage={leverage}
                        />
                    )
                }
            </div>
        </div>
    )
};

interface NewBalanceContainer {
    useLeverage: boolean
    buyField: string
    maxBuy: boolean
    leverage: number
}
export const NewBalanceContainer: FC<NewBalanceContainer> = ({
    useLeverage,
    buyField,
    maxBuy,
    leverage,
}) => {
    const coinBalance = useUserCoinBalance()
    const dollarBalance = useUserDollarBalance()
    const lastPrice = useLastPrice()
    const selectedCrypto = useSelectedCoin()

    const price = getPriceWithProperZeroes(Number(lastPrice))
    const fees = Number(buyField) * .003

    const actualBuyingPower = Number(buyField) - fees
    // @ts-ignore
    const leveragedBuyingPower = actualBuyingPower * leverageMap[leverage]

    const newCoins = useLeverage ? Number(leveragedBuyingPower) / Number(price) : Number(actualBuyingPower) / Number(price)

    const newCoinBalance = Number(coinBalance[selectedCrypto] || 0) + newCoins
    const remainingBalance = maxBuy ? 0 : dollarBalance - Number(buyField)

    return (
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
    )
}

export default BuyContainer
