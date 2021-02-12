import React, { useState, useEffect } from 'react'

import { RootState, useAppDispatch } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ReactEcharts from 'echarts-for-react';
import { fetchCoinPrice, setLastPrice, setTimeInterval, timeIntervalsList } from '../redux/reducers/price';
import { generateChart } from './chartOptions';
import { clearTrades } from '../redux/reducers/marketTrades';
import { getPriceWithProperZeroes, nameMap, tickerMap } from './BalanceContainer';
import { CoinIcon } from './DrawerComponent';

import './ChartContainer.scss'

export interface ZoomInfo {
    start: number,
    end: number,
}

export const ChartContainer = (props: Props) => {
    const dispatch = useAppDispatch()

    const [chartData, setChartData] = useState<any>()
    // before the last price
    const [previousPrice, setPreviousPrice] = useState<number>(0)
    const [color, setColor] = useState<'green' | 'red'>('green')
    const [zoomData, setZoomData] = useState<ZoomInfo>({ start: 50, end: 100 })

    const [events] = useState({
        'dataZoom': (event: any) => {
            setZoomData(event.batch[0])
        }
    })

    useEffect(() => {
        if (Number(props.lastPrice) > previousPrice) {
            setColor('green')
        } else if (Number(props.lastPrice) < previousPrice) {
            setColor('red')
        }

        setPreviousPrice(props.lastPrice)
    }, [props.lastPrice])

    useEffect(() => {
        dispatch(fetchCoinPrice({
            ticker: props.selectedCrypto,
            exchange: props.coinMap[props.selectedCrypto].exchange,
            interval: props.selectedInterval,
            coins: props.coins,
        }))
        // @ts-ignore
    }, [props.selectedInterval, props.selectedCrypto])

    useEffect(() => {
        if (props.prices && props.prices[props.selectedCrypto] && props.prices[props.selectedCrypto][props.selectedInterval]) {
            const intervals = props.prices[props.selectedCrypto][props.selectedInterval].map(candle => candle.x)
            // O: 0, H: 1, L: 2, C: 3
            // O C L H
            const seriesData = props.prices[props.selectedCrypto][props.selectedInterval].map(candle => [candle.y[0], candle.y[3], candle.y[2], candle.y[1]])
            const volumes = props.prices[props.selectedCrypto][props.selectedInterval].map((candle, index) => {
                const candleOpen = candle.y[0]
                const candleClosed = candle.y[3]

                return [index, candle.z[0], candleOpen < candleClosed ? 1 : -1]
            })

            const options = generateChart(tickerMap[props.selectedCrypto], intervals, seriesData, volumes, zoomData)
            setChartData(options)
        }
    }, [props.prices])

    const tickerPrice = getPriceWithProperZeroes(props.lastPrice)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginLeft: 15, marginRight: 15, marginTop: 8 }}>
                        { /* @ts-ignore */ }
                        <CoinIcon name={props.selectedCrypto} />
                    </div>
                    <h2 style={{ color: '#8a939f', margin: 0 }}>{tickerMap[props.selectedCrypto]}: $ </h2>
                    <h2 style={{ margin: 0, color }}> {tickerPrice}</h2>
                </div>
                <div>
                    <Select
                        value={props.selectedInterval}
                        onChange={(event: any) => {
                            dispatch(setTimeInterval(event.target.value))
                            dispatch(clearTrades(props.selectedCrypto))
                        }}
                        style={{ color: '#8a939f', borderColor: '#8a939f', height: '100%' }}
                    >
                        { timeIntervalsList.map(interval => <MenuItem key = {interval.value} value={interval.value}>{interval.name}</MenuItem>) }
                    </Select>
                </div>
            </div>
            {
                props.candlesLoading === 'success' && chartData && (
                    <ReactEcharts
                        option={chartData}
                        notMerge={false}
                        lazyUpdate={true}
                        onEvents={events}
                        style={{ top: -40 }}
                    />
                )
            }
        </div>
    )
};

const mapStateToProps = (state: RootState) => ({
    candlesLoading: state.price.loading,
    coins: state.coins.coins,
    coinMap: state.coins.map,
    lastPrice: state.price.lastPrice,
    prices: state.price.prices,
    selectedCrypto: state.coins.selectedCoin,
    selectedInterval: state.price.selectedInterval,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(ChartContainer)