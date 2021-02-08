import React, { useState, useEffect } from 'react'

import ApexChart from 'react-apexcharts'

import { RootState } from '../redux/store'

import { connect, ConnectedProps } from 'react-redux'
import { useAppDispatch } from '../redux/store'
import { setDollars } from '../redux/reducers/user'
import { addCoinQuantity, setCoinQuantity } from '../redux/reducers/usersCoins'
import { fetchCoinPrice, setSubscriptions, setTimeInterval } from '../redux/reducers/price'
import { Button, CircularProgress, InputBase, MenuItem, Select, TextField } from '@material-ui/core'
import Paper from '@material-ui/core/Paper';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import ws from '../websocket/cryptoPrice2'

const chartOptions = {
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
}

const tickerMap: any = {
    'btcusd': 'BTC/USD',
    'ethusd': 'ETH/USD',
}

const nameMap: any = {
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum',
}

const Dashboard = (props: Props) => {
    const dispatch = useAppDispatch()

    const [toggleInput, setToggleInput] = useState('buy')

    const [series, setSeries] = useState<Array<any>>([])
    const [buyField, setBuyField] = useState('')
    const [buyLoading, setBuyLoading] = useState(false)
    const [sellField, setSellField] = useState('')
    const [sellLoading, setSellLoading] = useState(false)
    const [websocket, setWebsocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        websocket?.send(JSON.stringify({ type: 'changeCrypto', currencyPairId: props.coinMap[props.selectedCrypto].cryptowatchID }))
    }, [props.selectedCrypto])

    useEffect(() => {
        websocket?.send(JSON.stringify({ type: 'changeInterval', interval: props.selectedInterval }))
    }, [props.selectedInterval])

    useEffect(() => {
        if (props.pricesLoading === 'success' && props.websocketConnected === 'idle') {
            console.log('hereasdsdfsdf')
            setWebsocket(ws())
        }
    }, [props.pricesLoading])

    useEffect(() => {
        dispatch(fetchCoinPrice({
            ticker: props.selectedCrypto,
            interval: props.selectedInterval
        }))
    }, [props.selectedInterval, props.selectedCrypto])

    if (props.candlesLoading !== 'success' || props.userLoading !== 'success') {
        return (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size = {80} />
            </div>
        )
    }

    const handleBuy = () => {
        setBuyLoading(true)
        fetch(`http://76.88.89.155:8080/coins/buy/${props.selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ dollars: buyField, uuid: props.userUUID, priceAtExecution: props.lastPrice })
        })
            .then(res => res.json())
            .then(data => {
                const updateInfo = data.data
                dispatch(setCoinQuantity({
                    ticker: props.selectedCrypto,
                    quantity: updateInfo.newCoinAmount
                }))
                dispatch(setDollars(updateInfo.newDollars))
                setBuyLoading(false)
                setBuyField('0')
            })
            .catch(err => {
                console.log(err)
                setBuyLoading(false)
            })
    }

    const handleSell = () => {
        setSellLoading(true)
        fetch(`http://76.88.89.155:8080/coins/sell/${props.selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ amount: sellField, uuid: props.userUUID, priceAtExecution: props.lastPrice })
        })
            .then(res => res.json())
            .then(data => {
                const updateInfo = data.data
                dispatch(setCoinQuantity({
                    ticker: props.selectedCrypto,
                    quantity: updateInfo.newCoinAmount
                }))
                dispatch(setDollars(updateInfo.newDollars))
                setSellLoading(false)
                setSellField('0')
            })
            .catch(err => {
                console.log(err)
                setSellLoading(false)
            })
    }

    return (
        <div style={{ height: '100%' }}>
            <div style= {{ display: 'flex', height: '100%' }}>
                <div style = {{ color: '#8a939f', borderRight: '1px solid #262d34', padding: 10, height: '100%' }}>
                    <div style = {{ borderBottom: '1px solid #262d34', marginBottom: 15 }}>
                        <h2>{tickerMap[props.selectedCrypto]}: ${props.lastPrice}</h2>
                        <p>Balance:</p>
                        <p>${Number(props.dollarBalance).toFixed(2)}</p>
                        <p>{nameMap[props.coinMap[props.selectedCrypto].name]}: {Number(props.coinBalance[props.selectedCrypto]).toFixed(6)}</p>
                    </div>
                    <ToggleButtonGroup
                        style = {{ width: '100%', maxHeight: 50 }}
                        value={toggleInput}
                        exclusive
                        onChange={(event: any, newAlignment: any) => setToggleInput(newAlignment)}
                        aria-label="text alignment"
                    >
                        <ToggleButton 
                            value="buy" 
                            aria-label="left aligned" 
                            style = {{ 
                                backgroundColor: toggleInput === 'buy' ? '#2eae34' : '#263543',
                                color: toggleInput === 'buy' ? 'white' : '#8a939f',
                                flexGrow: 1
                            }}
                        >
                            <p>Buy</p>
                        </ToggleButton>
                        <ToggleButton 
                            value="sell" 
                            aria-label="left aligned" 
                            style = {{ 
                                backgroundColor: toggleInput === 'sell' ? '#f9672d' : '#263543',
                                color: toggleInput === 'sell' ? 'white' : '#8a939f',
                                flexGrow: 1
                            }}
                        >
                            <p>Sell</p>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    {
                        toggleInput === 'buy' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #262d34' }}>
                                <p style={{ color: '#8a939f' }}>Amount</p>
                                <div style={{ display: 'flex', maxHeight: 50 }}>
                                    <Paper component="form" style = {{ backgroundColor: "#263543", maxHeight: 50, height: 50 }}>
                                        <Button 
                                            style = {{ backgroundColor: '#263543', height: 50, color: '#8a939f' }}
                                            variant="text" 
                                            onClick={() => setBuyField(props.dollarBalance + "")} 
                                        >
                                            Max
                                        </Button>
                                        <InputBase
                                            placeholder="0.00"
                                            inputProps={{ 'aria-label': 'search google maps' }}
                                            value={buyField} 
                                            style = {{
                                                backgroundColor: '#263543',
                                                color: 'white',
                                                marginLeft: 10,
                                            }}
                                            onChange={event => setBuyField(event.target.value)} 
                                        />
                                        <Button 
                                            variant="contained" 
                                            onClick={handleBuy} 
                                            disabled={buyLoading || sellLoading}
                                            style = {{
                                                backgroundColor: '#2eae34',
                                                color: 'white',
                                                height: 50
                                            }}
                                        >
                                            {
                                                buyLoading ? (
                                                    <CircularProgress size = {15} />
                                                ) : 'BUY'
                                            }
                                        </Button>
                                    </Paper>
                                </div>
                                {
                                    buyField && (
                                        <div>
                                            <h2>Details</h2>
                                            <div style={{ marginLeft: 7 }}>
                                                <div>
                                                    <h2 style={{ marginBottom: 3 }}>{nameMap[props.coinMap[props.selectedCrypto].name]}</h2>
                                                    <p style={{ marginTop: 0, marginLeft: 10}}>+{Number(Number(buyField) / props.lastPrice).toFixed(6)}</p>
                                                </div>
                                                <div>
                                                    <h2 style={{ marginBottom: 3 }}>Remaining </h2>
                                                    <p style={{ marginTop: 0, marginLeft: 10 }}>${Number(Number(props.dollarBalance) - Number(buyField)).toFixed(6)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <p style={{ color: '#8a939f' }}>Amount</p>
                                <div style={{ display: 'flex', maxHeight: 50 }}>
                                    <Paper component="form" style = {{ backgroundColor: "#263543", maxHeight: 50, height: 50 }}>
                                        <Button 
                                            style = {{ backgroundColor: '#263543', height: 50, color: '#8a939f' }}
                                            variant="text" 
                                            onClick={() => setSellField(Number(props.coinBalance[props.selectedCrypto]).toFixed(6) + "")} 
                                        >
                                            Max
                                        </Button>
                                        <InputBase
                                            placeholder="0.00"
                                            inputProps={{ 'aria-label': 'search google maps' }}
                                            value={sellField} 
                                            style = {{
                                                backgroundColor: '#263543',
                                                color: 'white',
                                                marginLeft: 10,
                                            }}
                                            onChange={event => setSellField(event.target.value)} 
                                        />
                                        <Button 
                                            variant="contained" 
                                            onClick={handleSell} 
                                            disabled={buyLoading || sellLoading}
                                            style = {{
                                                backgroundColor: '#f9672d',
                                                color: 'white',
                                                height: 50
                                            }}
                                        >
                                            {
                                                buyLoading ? (
                                                    <CircularProgress size = {15} />
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
                                                    <p style={{ marginTop: 0, marginLeft: 10}}>+ ${Number(Number(sellField) * props.lastPrice).toFixed(6)}</p>
                                                    <p style={{ marginTop: 0, marginLeft: 10}}>New Balance: ${Number(Number(sellField) * props.lastPrice + props.dollarBalance).toFixed(6)}</p>
                                                </div>
                                                <div>
                                                    <h2 style={{ marginBottom: 3 }}>Remaining {nameMap[props.coinMap[props.selectedCrypto].name]}</h2>
                                                    <p style={{ marginTop: 0, marginLeft: 10 }}>{Number(props.coinBalance[props.selectedCrypto] - Number(sellField)).toFixed(6)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
                <div style = {{ flexGrow: 1 }}>
                    <div style= {{ display: 'flex', flexDirection: 'column' }}>
                        <div style= {{ display: 'flex' }}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={props.selectedInterval}
                                onChange={(event: any) => dispatch(setTimeInterval(event.target.value))}
                            >
                                <MenuItem value="300">5M</MenuItem>
                                <MenuItem value="900">15M</MenuItem>
                                <MenuItem value="3600">1H</MenuItem>
                            </Select>
                        </div>
                        <ApexChart
                            options={chartOptions} 
                            series={[{data: props.prices[props.selectedCrypto][props.selectedInterval]}]} 
                            type="candlestick" height={500} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    dollarBalance: state.user.dollars,
    candlesLoading: state.price.loading,
    coinMap: state.coins.map,
    selectedCrypto: state.coins.selectedCoin,
    selectedInterval: state.price.selectedInterval,
    subscriptions: state.price.subscriptions,
    lastPrice: state.price.lastPrice,
    websocketConnected: state.price.websocketConnected,
    prices: state.price.prices,
    pricesLoading: state.price.loading,
    userLoading: state.price.loading,
    userUUID: state.user.uuid,
    coinBalance: state.usersCoins.tickers
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {
    
}

export default connector(Dashboard)