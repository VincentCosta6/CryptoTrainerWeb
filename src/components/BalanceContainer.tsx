import CircularProgress from '@mui/material/CircularProgress'

import { useUserCoinBalance, useUserCoinBalanceLoading } from '../redux/selectors/usersCoinsSelectors';
import { useCoinMap, useCoinsLoading, useSelectedCoin } from '../redux/selectors/coinSelectors';
import { useUserDollarBalance } from '../redux/selectors/userSelectors';

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

export const BalanceContainer = () => {
    const usersCoinsLoading = useUserCoinBalanceLoading()
    const coinsLoading = useCoinsLoading()
    
    const selectedCrypto = useSelectedCoin()
    const coinMap = useCoinMap()
    const coinBalance = useUserCoinBalance()
    const dollarBalance = useUserDollarBalance()
    
    if (usersCoinsLoading !== 'success' || coinsLoading !== 'success' || selectedCrypto === '') {
        return (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={80} />
            </div>
        )
    }

    return (
        <div style={{ borderBottom: '1px solid #262d34', marginBottom: 5, marginTop: 0 }}>
            <h1 style={{ marginTop: 0, fontSize: '1.6rem' }}>${numberWithCommasAndRounded(Number(dollarBalance), 2)}</h1>
            <h1 style={{ fontSize: '1.6rem' }}>{nameMap[coinMap[selectedCrypto].name]}: {numberWithCommasAndRounded(Number(coinBalance[selectedCrypto] || 0), 6)}</h1>
        </div>
    )
};

export default BalanceContainer
