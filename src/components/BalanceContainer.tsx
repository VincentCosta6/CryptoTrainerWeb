import React from 'react'

import { RootState } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'

import CircularProgress from '@material-ui/core/CircularProgress'

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

export const BalanceContainer = (props: Props) => {
    if (props.usersCoinsLoading !== 'success' || props.selectedCrypto === '') {
        return (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={80} />
            </div>
        )
    }

    return (
        <div style={{ borderBottom: '1px solid #262d34', marginBottom: 15 }}>
            <h2>{tickerMap[props.selectedCrypto]}: ${numberWithCommasAndRounded(props.lastPrice, 2)}</h2>
            <p>Balance:</p>
            <p>${numberWithCommasAndRounded(Number(props.dollarBalance), 2)}</p>
            <p>{nameMap[props.coinMap[props.selectedCrypto].name]}: {numberWithCommasAndRounded(Number(props.coinBalance[props.selectedCrypto]), 6)}</p>
        </div>
    )
};

const mapStateToProps = (state: RootState) => ({
    coinBalance: state.usersCoins.tickers,
    coinMap: state.coins.map,
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