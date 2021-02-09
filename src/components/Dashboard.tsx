import React, { useState, useEffect, useRef } from 'react'

import ReactEcharts from 'echarts-for-react';

import { RootState } from '../redux/store'

import { connect, ConnectedProps } from 'react-redux'
import { useAppDispatch } from '../redux/store'
import { setDollars } from '../redux/reducers/user'
import { addCoinQuantity, setCoinQuantity } from '../redux/reducers/usersCoins'
import { addTrade } from '../redux/reducers/trades'
import { fetchCoinPrice, setSubscriptions, setTimeInterval } from '../redux/reducers/price'
import { Button, CircularProgress, InputBase, MenuItem, Select, TextField } from '@material-ui/core'
import Paper from '@material-ui/core/Paper';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import ws from '../websocket/cryptoPrice2'

function toFixed(num: any, fixed: number) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function numberWithCommasAndRounded(x: any, length: number) {
    const fixed = toFixed(x, length)
    return fixed.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

const tickerMap: any = {
    'btcusd': 'BTC/USD',
    'ethusd': 'ETH/USD',
}

const nameMap: any = {
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum',
}

const charpOptions = {

}

const Dashboard = (props: Props) => {
    const chart = useRef<any>()
    const dispatch = useAppDispatch()

    const [toggleInput, setToggleInput] = useState('buy')
    const [chartData, setChartData] = useState<any>()

    const [series, setSeries] = useState<Array<any>>([])
    const [maxBuy, setMaxBuy] = useState(false)
    const [buyField, setBuyField] = useState('')
    const [buyLoading, setBuyLoading] = useState(false)
    const [maxSell, setMaxSell] = useState(false)
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

    useEffect(() => {
        if (props.prices && props.prices[props.selectedCrypto] && props.prices[props.selectedCrypto][props.selectedInterval]) {
            const intervals = props.prices[props.selectedCrypto][props.selectedInterval].map(candle => candle.x)
            // O: 0, H: 1, L: 2, C: 3
            // O C L H
            const sliceNumber = props.prices[props.selectedCrypto][props.selectedInterval].length - 100

            const seriesData = props.prices[props.selectedCrypto][props.selectedInterval].map(candle => [candle.y[0], candle.y[3], candle.y[2], candle.y[1]]).slice(sliceNumber)
            const volumes = props.prices[props.selectedCrypto][props.selectedInterval].map((candle, index) => {
                const sameCandle = props.prices[props.selectedCrypto][props.selectedInterval][index]

                const candleOpen = sameCandle.y[0]
                const candleClosed = sameCandle.y[3]

                return [index, candle.z[0], candleOpen < candleClosed ? 1 : -1]
            }).slice(sliceNumber)

            const upColor = '#47b262'
            const downColor = '#eb5454'

            const options = {
                grid: [
                    {
                        left: '5%',
                        right: '1%',
                        height: '50%'
                    },
                    {
                        left: '5%',
                        right: '1%',
                        top: '65%',
                        height: '25%'
                    }
                ],
                legend: {
                    bottom: 10,
                    left: 'center',
                    data: ['Dow-Jones index']
                },
                axisPointer: {
                    link: {xAxisIndex: 'all'},
                    label: {
                        backgroundColor: '#777'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    textStyle: {
                        color: '#000'
                    },
                    position: function (pos: any, params: any, el: any, elRect: any, size: any) {
                        var obj = {top: 10};
                        // @ts-ignore
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    }
                    // extraCssText: 'width: 170px'
                },
                brush: {
                    xAxisIndex: 'all',
                    brushLink: 'all',
                    outOfBrush: {
                        colorAlpha: 0.1
                    }
                },
                visualMap: {
                    show: false,
                    seriesIndex: 1,
                    pieces: [{
                        value: 1,
                        color: upColor
                    }, {
                        value: -1,
                        color: downColor
                    }]
                },
                xAxis: [
                    {
                        type: 'category',
                        data: intervals,
                        scale: true,
                        boundaryGap: false,
                        axisLine: {onZero: false},
                        splitLine: {show: false},
                        splitNumber: 20,
                        min: 'dataMin',
                        max: 'dataMax',
                        axisPointer: {
                            z: 100
                        }
                    },
                    {
                        type: 'category',
                        gridIndex: 1,
                        data: intervals,
                        scale: true,
                        boundaryGap: false,
                        axisLine: {onZero: false},
                        axisTick: {show: false},
                        splitLine: {show: false},
                        axisLabel: {show: false},
                        splitNumber: 20,
                        min: 'dataMin',
                        max: 'dataMax'
                    }
                    
                ],
                yAxis: [
                    {
                        scale: true,
                    },
                    {
                        scale: true,
                        gridIndex: 1,
                        splitNumber: 2,
                        axisLabel: {show: true},
                        axisLine: {show: true},
                        axisTick: {show: false},
                        splitLine: {show: false},
                    }
                ],
                series: [
                    {
                        name: 'Dow-Jones index',
                        type: 'candlestick',
                        data: seriesData,
                        itemStyle: {
                            color: upColor,
                            color0: downColor,
                            borderColor: null,
                            borderColor0: null
                        },
                        tooltip: {
                            formatter: function (param: any) {
                                param = param[0];
                                return [
                                    'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                                    'Open: ' + param.data[0] + '<br/>',
                                    'Close: ' + param.data[1] + '<br/>',
                                    'Lowest: ' + param.data[2] + '<br/>',
                                    'Highest: ' + param.data[3] + '<br/>'
                                ].join('');
                            }
                        }
                    },
                    {
                        name: 'Volume',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: volumes,
                    }
                ],
                darkMode: true
            }

            if(false) {
                // @ts-ignore
                chart.current.setOption({
                    series: [{
                        data: seriesData
                    }]
                })
            } else {
                setChartData(options)
            }
        }
    }, [props.prices])

    if (props.candlesLoading !== 'success' || props.userLoading !== 'success') {
        return (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={80} />
            </div>
        )
    }

    const handleBuy = () => {
        setBuyLoading(true)
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
                setBuyLoading(false)
                setBuyField('0')
                setMaxBuy(false)
            })
            .catch(err => {
                console.log(err)
                setBuyLoading(false)
                setMaxBuy(false)
            })
    }

    const handleSell = () => {
        setSellLoading(true)
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
        <div style={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ color: '#8a939f', borderRight: '1px solid #262d34', padding: 10 }}>
                    <div style={{ borderBottom: '1px solid #262d34', marginBottom: 15 }}>
                        <h2>{tickerMap[props.selectedCrypto]}: ${numberWithCommasAndRounded(props.lastPrice, 2)}</h2>
                        <p>Balance:</p>
                        <p>${numberWithCommasAndRounded(Number(props.dollarBalance), 2)}</p>
                        <p>{nameMap[props.coinMap[props.selectedCrypto].name]}: {numberWithCommasAndRounded(Number(props.coinBalance[props.selectedCrypto]), 6)}</p>
                    </div>
                    <ToggleButtonGroup
                        style={{ width: '100%', maxHeight: 50 }}
                        value={toggleInput}
                        exclusive
                        onChange={(event: any, newAlignment: any) => setToggleInput(newAlignment)}
                        aria-label="text alignment"
                    >
                        <ToggleButton
                            value="buy"
                            aria-label="left aligned"
                            style={{
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
                            style={{
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
                                            onClick={handleBuy}
                                            disabled={buyLoading || sellLoading}
                                            style={{
                                                backgroundColor: '#2eae34',
                                                color: 'white',
                                                height: 50
                                            }}
                                        >
                                            {
                                                buyLoading ? (
                                                    <CircularProgress size={15} />
                                                ) : 'BUY'
                                            }
                                        </Button>
                                    </Paper>
                                </div>
                                {
                                    buyField && (
                                        <div>
                                            <div style={{ marginLeft: 7 }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <h2 style={{ marginBottom: 3, marginTop: 0 }}>{nameMap[props.coinMap[props.selectedCrypto].name]}</h2>
                                                    <p style={{ marginTop: 0, marginBottom: 0, marginLeft: 3 }}>+{numberWithCommasAndRounded(Number(Number(buyField) / props.lastPrice), 6)}</p>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
                                                    <h2 style={{ marginBottom: 3, marginTop: 0 }}>Remaining </h2>
                                                    <p style={{ marginTop: 0, marginBottom: 0, marginLeft: 3 }}>${numberWithCommasAndRounded(Number(Number(props.dollarBalance) - Number(buyField)), 2)}</p>
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
                                                disabled={buyLoading || sellLoading}
                                                style={{
                                                    backgroundColor: '#f9672d',
                                                    color: 'white',
                                                    height: 50
                                                }}
                                            >
                                                {
                                                    buyLoading ? (
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
                    }
                </div>
                <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex' }}>
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
                        {/*<ApexChart
                            options={chartOptions} 
                            series={[{data: props.prices[props.selectedCrypto][props.selectedInterval]}]} 
                            type="candlestick" height={500} 
                        />*/}
                        {
                            chartData && (
                                <ReactEcharts
                                    option={chartData}
                                    notMerge={true}
                                    lazyUpdate={true}
                                    ref={chart}
                                />
                            )
                        }
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