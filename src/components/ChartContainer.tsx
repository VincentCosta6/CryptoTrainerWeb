import { useState, useEffect, memo } from 'react'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import ReactEcharts from 'echarts-for-react'

import moment from 'moment'

import { CoinIcon } from './DrawerComponent'

import { clearTrades } from '../redux/reducers/marketTrades'
import { fetchCoinPrice, setTimeInterval, timeIntervalsList } from '../redux/reducers/price'

import { useAppDispatch } from '../redux/store'
import { useLastPrice, usePriceLoading, usePrices, useSelectedInterval } from '../redux/selectors/priceSelectors'
import { useCoinMap, useCoins, useSelectedCoin } from '../redux/selectors/coinSelectors'

import { getPriceWithProperZeroes, tickerMap } from './BalanceContainer'
import { generateChart } from './chartOptions'

import './ChartContainer.scss'
export interface ZoomInfo {
    start: number,
    end: number,
}

const formatMap = {
    '60': (candle: number) =>  moment(candle).format('h:mm A'),
    '300': (candle: number) =>  moment(candle).format('h:mm A'),
    '900': (candle: number) =>  moment(candle).format('dd h:mm A'),
    '3600': (candle: number) =>  moment(candle).format('dd h:mm A'),
    '14400': (candle: number) =>  moment(candle).format('MM/DD h:mm A'),
    '86400': (candle: number) =>  moment(candle).format('MM/DD h:mm A'),
}

export const ChartContainer = () => {
    const dispatch = useAppDispatch()

    const candlesLoading = usePriceLoading()

    const lastPrice = useLastPrice()
    const selectedCrypto = useSelectedCoin()
    const coinMap = useCoinMap()
    const selectedInterval = useSelectedInterval()
    const coins = useCoins()
    const prices = usePrices()

    const [chartData, setChartData] = useState<any>()
    // before the last price
    const [previousPrice, setPreviousPrice] = useState<number>(0)
    const [color, setColor] = useState<'green' | 'red'>('green')
    const [zoomData, setZoomData] = useState<ZoomInfo>({ start: 50, end: 100 })

    const [events] = useState({
        'dataZoom': (event: any) => {
            if (event.batch)
                setZoomData(event.batch[0])
            else 
                setZoomData(event)
        }
    })

    useEffect(() => {
        if (Number(lastPrice) > previousPrice) {
            setColor('green')
        } else if (Number(lastPrice) < previousPrice) {
            setColor('red')
        }

        setPreviousPrice(lastPrice)
    }, [lastPrice])

    useEffect(() => {
        dispatch(fetchCoinPrice({
            ticker: selectedCrypto,
            exchange: coinMap[selectedCrypto].exchange,
            interval: selectedInterval,
            coins: coins,
        }))
        // @ts-ignore
    }, [selectedInterval, selectedCrypto])

    useEffect(() => {
        if (prices && prices[selectedCrypto] && prices[selectedCrypto][selectedInterval]) {
            // @ts-ignore
            const intervals = prices[selectedCrypto][selectedInterval].map(candle => formatMap[selectedInterval](candle.x))
            // O: 0, H: 1, L: 2, C: 3
            // O C L H
            const seriesData = prices[selectedCrypto][selectedInterval].map(candle => [candle.y[0], candle.y[3], candle.y[2], candle.y[1]])
            const volumes = prices[selectedCrypto][selectedInterval].map((candle, index) => {
                const candleOpen = candle.y[0]
                const candleClosed = candle.y[3]

                return [index, candle.z[0], candleOpen < candleClosed ? 1 : -1]
            })

            const options = generateChart(tickerMap[selectedCrypto], intervals, seriesData, volumes, zoomData)
            setChartData(options)
        }
    }, [prices])

    const tickerPrice = getPriceWithProperZeroes(lastPrice)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginLeft: 15, marginRight: 15, marginTop: 8 }}>
                        { /* @ts-ignore */ }
                        <CoinIcon name={selectedCrypto} />
                    </div>
                    <h1 style={{ color: '#8a939f', margin: 0, fontSize: '2.4rem' }}>{tickerMap[selectedCrypto]}: $ </h1>
                    <h1 style={{ margin: 0, color, fontSize: '2.4rem' }}> {tickerPrice}</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIntervalSelector />
                </div>
            </div>
                {
                    candlesLoading === 'success' && chartData && (
                        <ReactEcharts
                            option={chartData}
                            notMerge={false}
                            lazyUpdate={true}
                            onEvents={events}
                        />
                    )
                }
        </div>
    )
};

const TimeIntervalSelector = memo(() => {
    const dispatch = useAppDispatch()

    const selectedCrypto = useSelectedCoin()
    const selectedInterval = useSelectedInterval()

    return (
        <Select
            variant="standard"
            value={selectedInterval}
            onChange={(event: any) => {
                dispatch(setTimeInterval(event.target.value))
                dispatch(clearTrades(selectedCrypto))
            }}
            style={{ color: '#8a939f', borderColor: '#8a939f' }}
        >
            { timeIntervalsList.map(interval => <MenuItem key={interval.value} value={interval.value}>{interval.name}</MenuItem>) }
        </Select>
    )
})

export default ChartContainer
