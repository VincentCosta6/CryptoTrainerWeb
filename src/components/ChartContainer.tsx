import React, { useState, useEffect } from 'react'

import { RootState, useAppDispatch } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ReactEcharts from 'echarts-for-react';
import { fetchCoinPrice, setTimeInterval } from '../redux/reducers/price';
import { generateChart } from './chartOptions';

export const ChartContainer = (props: Props) => {
    const dispatch = useAppDispatch()

    const [chartData, setChartData] = useState<any>()

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
            const seriesData = props.prices[props.selectedCrypto][props.selectedInterval].map(candle => [candle.y[0], candle.y[3], candle.y[2], candle.y[1]])
            const volumes = props.prices[props.selectedCrypto][props.selectedInterval].map((candle, index) => {
                const candleOpen = candle.y[0]
                const candleClosed = candle.y[3]

                return [index, candle.z[0], candleOpen < candleClosed ? 1 : -1]
            })

            const options = generateChart(intervals, seriesData, volumes)
            setChartData(options)
        }
    }, [props.prices])


    return (
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
            {
                props.candlesLoading === 'success' && chartData && (
                    <ReactEcharts
                        option={chartData}
                        notMerge={false}
                        lazyUpdate={true}
                    />
                )
            }
        </div>
    )
};

const mapStateToProps = (state: RootState) => ({
    candlesLoading: state.price.loading,
    prices: state.price.prices,
    selectedCrypto: state.coins.selectedCoin,
    selectedInterval: state.price.selectedInterval,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(ChartContainer)