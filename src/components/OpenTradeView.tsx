import { FC } from 'react'

import { LeveragedTradeType } from '../redux/reducers/leveragedTrade';
import { getPriceWithProperZeroes, numberWithCommasAndRounded } from './BalanceContainer';
import { useLastPrice } from '../redux/selectors/priceSelectors';

interface OpenTradeViewProps {
    trade: LeveragedTradeType | null
}
export const OpenTradeView: FC<OpenTradeViewProps> = ({ trade }) => {
    const lastPrice = useLastPrice()

    if (!trade) {
        return <p>loading</p>
    }

    const valueAtPurchase = Number(trade.leveragedBuyingPower)
    const currentValue = trade.quantity * Number(lastPrice)

    const leveragedChange = currentValue - valueAtPurchase

    const percentageIncrease = leveragedChange / Number(trade.initialMargin) * 100

    return (
        <div style={{ color: '#8a939e' }}>
            <div style={{ display: 'flex', marginBottom: 0 }}>
                <div style={{ display: 'flex', marginBottom: 0 }}>  
                    <p>Type: </p>
                    <p style={{ color: trade.type === 'BUY' ? 'green' : 'red', marginLeft: 5 }}> {trade.type} {trade.leverageTimes}x</p>
                </div>
                <div style={{ display: 'flex', marginBottom: 0, marginLeft: 15 }}>  
                    <p>Price: ${getPriceWithProperZeroes(Number(trade.executedPrice))}</p>
                </div>
            </div>
            <p>Margin: ${numberWithCommasAndRounded(Number(trade.initialMargin), 2)} </p>
            <p>Starting power: ${numberWithCommasAndRounded(Number(trade.leveragedBuyingPower), 2)}</p>
            <p>Current power: ${numberWithCommasAndRounded(currentValue, 2)}</p>

            <div style={{ display: 'flex' }}>
                <p>Change: $ </p>
                <p style={{ color: percentageIncrease < 0 ? 'red' : 'green', marginRight: 5 }}>{leveragedChange > 0 ? '+' : ''}{numberWithCommasAndRounded(leveragedChange, 2)}</p>
                <p>(</p>
                <p style={{ color: percentageIncrease < 0 ? 'red' : 'green' }}>{percentageIncrease > 0 ? '+' : ''}{numberWithCommasAndRounded(percentageIncrease, 2)}%</p>
                <p>)</p>
            </div>
        </div>
    )
};

export default OpenTradeView