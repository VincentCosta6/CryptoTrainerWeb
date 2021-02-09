import React, { useState } from 'react'

import BuyContainer from './BuyContainer'
import SellContainer from './SellContainer'

import { RootState } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'

import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

export const TradingActionContainer = (props: Props) => {
    const [toggleInput, setToggleInput] = useState('buy')

    const [buyLoading, setBuyLoading] = useState(false)
    const [sellLoading, setSellLoading] = useState(false)

    return (
        <div>
            <ToggleButtonGroup
                style={{ width: '100%', maxHeight: 50 }}
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

const mapStateToProps = (state: RootState) => ({

})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(TradingActionContainer)