import React from 'react'

import { RootState } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'

import CircularProgress from '@material-ui/core/CircularProgress'

export function toFixed(num: any, fixed: number) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

export function numberWithCommasAndRounded(x: any, length: number) {
    const fixed = toFixed(x, length)
    return fixed.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export const tickerMap: any = {
    'btcusd': 'BTC/USD',
    'ethusd': 'ETH/USD',
    'dogeusdt': 'DOGE/USDT'
}

export const nameMap: any = {
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum',
    'dogecoin': 'Dogecoin',
}

export function getPriceWithProperZeroes(price: number | string) {
    const pricenNum = Number(price)
    let zeroes = 2

    if (price < 1) {
        zeroes = 10
    } else if (price < 100) {
        zeroes = 8
    } else if (price < 1000) {
        zeroes = 6
    } else if (price < 10000) {
        zeroes = 4
    }

    return toFixed(pricenNum, zeroes)
}

export const BalanceContainer = (props: Props) => {
    if (props.usersCoinsLoading !== 'success' || props.coinsLoading !== 'success' || props.selectedCrypto === '') {
        return (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={80} />
            </div>
        )
    }

    return (
        <div style={{ borderBottom: '1px solid #262d34', marginBottom: 5, marginTop: 0 }}>
            <p style={{ marginTop: 0 }}>${numberWithCommasAndRounded(Number(props.dollarBalance), 2)}</p>
            <p>{nameMap[props.coinMap[props.selectedCrypto].name]}: {numberWithCommasAndRounded(Number(props.coinBalance[props.selectedCrypto] || 0), 6)}</p>
        </div>
    )
};

const mapStateToProps = (state: RootState) => ({
    coinBalance: state.usersCoins.tickers,
    coinMap: state.coins.map,
    coinsLoading: state.coins.loading,
    dollarBalance: state.user.dollars,
    lastPrice: state.price.lastPrice,
    usersCoinsBalance: state.usersCoins.tickers,
    usersCoinsLoading: state.usersCoins.loading,
    selectedCrypto: state.coins.selectedCoin,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(BalanceContainer)