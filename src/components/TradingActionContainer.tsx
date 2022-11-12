import { useState } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import BuyContainer from './BuyContainer'
import SellContainer from './SellContainer'

import { useCoinsLoading } from '../redux/selectors/coinSelectors'

export const TradingActionContainer = () => {
    const coinsLoading = useCoinsLoading()

    const [toggleInput, setToggleInput] = useState('buy')

    const [buyLoading, setBuyLoading] = useState(false)
    const [sellLoading, setSellLoading] = useState(false)

    if (coinsLoading !== 'success') {
        return (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={80} />
            </div>
        )
    }

    return (
        <div>
            <ToggleButtonGroup
                style={{ width: '100%', maxHeight: 35 }}
                value={toggleInput}
                exclusive
                onChange={(event: any, newAlignment: any) => setToggleInput(newAlignment)}
                aria-label="text alignment"
            >
                <ToggleButton
                    value="buy"
                    aria-label="left aligned"
                    style={{
                        backgroundColor: toggleInput === 'buy' ? '#2eae34' : '#263543',
                        color: toggleInput === 'buy' ? 'white' : '#8a939f',
                        flexGrow: 1
                    }}
                >
                    <p>Buy</p>
                </ToggleButton>
                <ToggleButton
                    value="sell"
                    aria-label="left aligned"
                    style={{
                        backgroundColor: toggleInput === 'sell' ? '#f9672d' : '#263543',
                        color: toggleInput === 'sell' ? 'white' : '#8a939f',
                        flexGrow: 1
                    }}
                >
                    <p>Sell</p>
                </ToggleButton>
            </ToggleButtonGroup>
            {
                toggleInput === 'buy' ? 
                    <BuyContainer buyLoading = {buyLoading} setBuyLoading={setBuyLoading} otherActionLoading={sellLoading} /> : 
                    <SellContainer sellLoading = {sellLoading} setSellLoading={setSellLoading} otherActionLoading={buyLoading} />
            }
        </div>
    )
};

export default TradingActionContainer