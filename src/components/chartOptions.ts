import { ZoomInfo } from "./ChartContainer";

export const upColor = '#47b262'
export const downColor = '#eb5454'

export const generateChart = (name: string, intervals: any, seriesData: any, volumes: any, zoomData: ZoomInfo) => {
    return {
        grid: [
            {
                left: '8%',
                right: '3%',
                height: '50%'
            },
            {
                left: '5%',
                right: '1%',
                top: '65%',
                height: '25%'
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                start: zoomData.start,
                end: zoomData.end
            },
            {
                show: true,
                type: 'slider',
                top: '90%',
                start: zoomData.start,
                end: zoomData.end
            }
        ],
        legend: {
            data: [name],
            bottom: 10,
            left: 'center',
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
                name,
                type: 'candlestick',
                data: seriesData,
                itemStyle: {
                    color: upColor,
                    color0: downColor,
                    borderColor: null,
                    borderColor0: null
                },
                tooltip: {
                    alwaysShowCOntent: true,
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
}