import { FC, useState } from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'

import { setDollars } from '../redux/reducers/user'
import { setCoinQuantity } from '../redux/reducers/usersCoins'
import { addTrade } from '../redux/reducers/trades'

import { useAppDispatch } from '../redux/store'
import { useCoinMap, useSelectedCoin } from '../redux/selectors/coinSelectors'
import { useUserCoinBalance } from '../redux/selectors/usersCoinsSelectors'
import { useUserDollarBalance, useUserUUID } from '../redux/selectors/userSelectors'
import { useLastPrice } from '../redux/selectors/priceSelectors'

import { getPriceWithProperZeroes, numberWithCommasAndRounded, toFixed } from './BalanceContainer'

interface TradingActionContainerProps {
    otherActionLoading: boolean
    sellLoading: boolean
    setSellLoading: Function
}
export const TradingActionContainer: FC<TradingActionContainerProps> = ({
    otherActionLoading,
    sellLoading,
    setSellLoading,
}) => {
    const dispatch = useAppDispatch()

    const coinMap = useCoinMap()
    const selectedCrypto = useSelectedCoin()

    const coinBalance = useUserCoinBalance()
    const userUUID = useUserUUID()

    const [maxSell, setMaxSell] = useState(false)
    const [sellField, setSellField] = useState('')

    const handleSell = () => {
        setSellLoading(true)
        fetch(`https://api.minecraftmarkets.com/coins/sell/${coinMap[selectedCrypto].exchange}/${selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: maxSell ? coinBalance[selectedCrypto] : sellField, uuid: userUUID, priceAtExecution: 0, max: maxSell })
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
                setSellLoading(false)
                setSellField('0')
                setMaxSell(false)
            })
            .catch(err => {
                console.log(err)
                setSellLoading(false)
                setMaxSell(false)
            })
    }

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
                            setSellField(toFixed(Number(coinBalance[selectedCrypto] || 0), 6) + "")
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
                        disabled={sellLoading || otherActionLoading}
                        style={{
                            backgroundColor: '#f9672d',
                            color: 'white',
                            height: 50
                        }}
                    >
                        {
                            sellLoading ? (
                                <CircularProgress size={15} />
                            ) : 'SELL'
                        }
                    </Button>
                </Paper>
            </div>
            <div style={{ marginTop: 10 }}>
                { sellField !== '' && (
                    <NewBalanceContainer 
                        sellField={sellField}
                        maxSell={maxSell}
                    />
                ) }
            </div>
        </div>
    )
}

interface NewBalanceContainerProps {
    sellField: string
    maxSell: boolean
}
export const NewBalanceContainer: FC<NewBalanceContainerProps> = ({
    sellField,
    maxSell,
}) => {
    const coinBalance = useUserCoinBalance()
    const dollarBalance = useUserDollarBalance()
    const lastPrice = useLastPrice()
    const selectedCrypto = useSelectedCoin()

    const price = getPriceWithProperZeroes(Number(lastPrice) * .99985)
    const fees = Number(sellField) * .003 * price

    const newMoney = Number(sellField) * Number(price) - fees

    const newBalance = Number(dollarBalance) + newMoney
    const remainingCoins = maxSell ? 0 : Number(coinBalance[selectedCrypto] || 0) - Number(sellField)

    return (
        <div style={{ marginLeft: 7 }}>
            <p style={{ marginTop: 0, marginLeft: 10 }}>Fees: ${numberWithCommasAndRounded(fees, 2)}</p>
            <p style={{ marginTop: 0, marginLeft: 10 }}>New Balance: ${numberWithCommasAndRounded(newBalance, 2)} (+${numberWithCommasAndRounded(newMoney, 2)})</p>
            <p style={{ marginTop: 0, marginLeft: 10 }}>Remaining: {numberWithCommasAndRounded(remainingCoins, 6)}</p>
        </div>
    )
}

export default TradingActionContainer