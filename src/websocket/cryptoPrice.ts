import ws from 'ws'

import store from '../redux/store'

import { addCandle, setCandle, setLastPrice, setWebsocketStatus, ApexCandle } from '../redux/reducers/price'


const apiKey = 'WTMHE824YVQC0G14BZ48'
const dispatch = store.dispatch

export function subscribe(resources: any) {
  console.log(cryptoWatchSocketClient)
  cryptoWatchSocketClient.send(JSON.stringify({
      subscribe: {
        subscriptions: resources.map((resource: any) => { return { streamSubscription: { resource: resource } } })
      }
    }))
}

export function unsubscribe(resources: any) {
  cryptoWatchSocketClient.send(JSON.stringify({
      unsubscribe: {
        subscriptions: resources.map((resource: any) => { return { streamSubscription: { resource: resource } } })
      }
    }))
}

let cryptoWatchSocketClient: any

const init = () => {
  console.log('here')

  cryptoWatchSocketClient = new WebSocket(`wss://stream.cryptowat.ch/connect?apikey=${apiKey}`);

  cryptoWatchSocketClient.onmessage = async (msg: any) => {
      const data = JSON.parse(await msg.data.text())

      if (data.authenticationResult && data.authenticationResult.status === 'AUTHENTICATED') {
        console.log('subbed')

        dispatch(setWebsocketStatus('success'))
      }

      const ticker = store.getState().coins.selectedCoin
      const intervalSelected = store.getState().price.selectedInterval

      const candleArr = store.getState().price.prices[ticker][intervalSelected]
      const currentInterval = candleArr[candleArr.length - 1]

      if (data.marketUpdate && currentInterval) {
        console.log(data.marketUpdate.intervalsUpdate.intervals.length)
          const myInterval = data.marketUpdate.intervalsUpdate.intervals.find((interval: any) => interval.periodName === intervalSelected)

          if (!myInterval) {
            return
          }

          const openPrice = Number(myInterval.ohlc.openStr)
          const highPrice = Number(myInterval.ohlc.highStr)
          const lowPrice = Number(myInterval.ohlc.lowStr)
          const closePrice = Number(myInterval.ohlc.closeStr)

          /*x: new Date(candle[0] * 1000),
                  y: [candle[1], candle[2], candle[3], candle[4]]*/

          const candle: ApexCandle = {
            x: Number(myInterval.closetime) * 1000,
            y: [openPrice, highPrice, lowPrice, closePrice]
          }

          const currentUnixTimestamp = Math.floor(currentInterval.x)

          dispatch(setLastPrice(closePrice))

          if (currentUnixTimestamp === Number(myInterval.closetime) * 1000) {
              dispatch(setCandle({
                  ticker: ticker,
                  intervalName: intervalSelected,
                  y: candle.y
              }))
          } else {
              dispatch(addCandle({
                  ticker: ticker,
                  intervalName: intervalSelected,
                  interval: candle
              }))
          }

          
      }
  }

  return cryptoWatchSocketClient
}



export default init