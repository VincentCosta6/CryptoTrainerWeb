import store from '../redux/store'

import { addCandle, setCandle, setLastPrice, setWebsocketStatus, ApexCandle, setWebsocket } from '../redux/reducers/price'

const dispatch = store.dispatch

let cryptoWatchSocketClient: any

const init = () => {
  console.log('here')

  cryptoWatchSocketClient = new WebSocket(`wss://minecraft-markets.herokuapp.com/websocket`);

  cryptoWatchSocketClient.onopen = () => {
    const selectedCrypto = store.getState().coins.selectedCoin

    dispatch(setWebsocketStatus('success'))

    cryptoWatchSocketClient.send(JSON.stringify({
      apiKey: store.getState().user.uuid,
      interval: store.getState().price.selectedInterval,
      currencyPairId: store.getState().coins.map[selectedCrypto].cryptowatchID
    }))
  }

  cryptoWatchSocketClient.onmessage = (msg: any) => {
    const data = JSON.parse(msg.data)

    if (data.status) {
      return
    }

    console.log(data)

    const ticker = store.getState().coins.selectedCoin
    const intervalSelected = store.getState().price.selectedInterval

    const candleArr = store.getState().price.prices[ticker][intervalSelected]
    const currentInterval = candleArr[candleArr.length - 1]

    if (!currentInterval) {
      return
    }

    const currentUnixTimestamp = Math.floor(currentInterval.x)

    dispatch(setLastPrice(data.candle.y[3]))

    if (currentUnixTimestamp === Math.floor(data.candle.x)) {
      dispatch(setCandle({
        ticker: ticker,
        intervalName: intervalSelected,
        y: data.candle.y
      }))
    } else {
      dispatch(addCandle({
        ticker: ticker,
        intervalName: intervalSelected,
        interval: data.candle
      }))
    }
  }

  cryptoWatchSocketClient.onerror = (err: any) => {
    console.log('Websocket new error', err)
  }

  return cryptoWatchSocketClient
}



export default init