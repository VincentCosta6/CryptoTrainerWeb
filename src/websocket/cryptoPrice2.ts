import store from '../redux/store'

import { addCandle, setCandle, setLastPrice, setWebsocketStatus } from '../redux/reducers/price'
import { addTrades } from '../redux/reducers/marketTrades'
import { getPriceWithProperZeroes } from '../components/BalanceContainer'
import { removeLeveragedTrade } from '../redux/reducers/leveragedTrade'
import { addLiquidation } from '../redux/reducers/liquidations'

const dispatch = store.dispatch

let cryptoWatchSocketClient: any

const init = (reconnectAttempt: boolean) => {
  cryptoWatchSocketClient = new WebSocket(`wss://api.minecraftmarkets.com/websocket`);

  dispatch(setWebsocketStatus('pending'))

  let myUUID: any

  cryptoWatchSocketClient.onopen = () => {
    const selectedCrypto = store.getState().coins.selectedCoin

    dispatch(setWebsocketStatus('success'))

    myUUID = store.getState().user.uuid

    if (reconnectAttempt) {
      // @ts-ignore
      document.location.reload()
    } else {
      cryptoWatchSocketClient.send(JSON.stringify({
        apiKey: store.getState().user.uuid,
        interval: store.getState().price.selectedInterval,
        currencyPairId: store.getState().coins.map[selectedCrypto].cryptowatchID
      }))
    }
  }

  cryptoWatchSocketClient.onmessage = (msg: any) => {
    const data = JSON.parse(msg.data)

    if (data.status) {
      return
    }

    if (data.type === 'liquidationNotice') {
      if (myUUID === data.type.leveragedTrade.playerUUID) {
        const liquidations = store.getState().liquidations.liquidations

        if (!liquidations.find(liquid => liquid._id === data.type.leveragedTrade.playerUUID)) {
          dispatch(addLiquidation(data.leveragedTrade))
          dispatch(removeLeveragedTrade(data.leveragedTrade))
        }
      }
      
    } 

    if (data.type === 'tradesUpdate') {
      const ticker = store.getState().coins.selectedCoin

      dispatch(addTrades({
        ticker,
        trades: data.trades
      }))
    }

    if (data.type === 'marketUpdate') {
      const ticker = store.getState().coins.selectedCoin
      const intervalSelected = store.getState().price.selectedInterval

      const candleArr = store.getState().price.prices[ticker][intervalSelected]
      const currentInterval = candleArr[candleArr.length - 1]

      if (!currentInterval) {
        return
      }

      const currentUnixTimestamp = Math.floor(currentInterval.x)

      dispatch(setLastPrice(data.candle.y[3]))
      document.title = getPriceWithProperZeroes(data.candle.y[3])

      if (currentUnixTimestamp === Math.floor(data.candle.x)) {
        dispatch(setCandle({
          ticker: ticker,
          intervalName: intervalSelected,
          y: data.candle.y,
          z: data.candle.z,
        }))
      } else {
        dispatch(addCandle({
          ticker: ticker,
          intervalName: intervalSelected,
          interval: data.candle,
        }))
      }
    }


  }

  cryptoWatchSocketClient.onerror = (err: ErrorEvent) => {
    dispatch(setWebsocketStatus('error'))
    console.log('Websocket new error', err)
  }

  cryptoWatchSocketClient.onclose = (event: CloseEvent) => {
    if (event.code === 1006) {
      dispatch(setWebsocketStatus('idle'))
    }

    console.log('Websocket closed code: ', event.code)
  }

  return cryptoWatchSocketClient
}



export default init