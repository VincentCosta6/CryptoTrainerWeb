import React, { useState } from 'react'

import BalanceContainer from './BalanceContainer'
import TradingActionContainer from './TradingActionContainer'
import OpenTrades from './OpenTrades'
import History from './History'

import { RootState } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'

import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import './LeftPanel.scss'

export const ChartContainer = (props: Props) => {
    const [activeTab, setActiveTab] = useState<string>("1")

    const handleChange = (event: any, newValue: any) => {
        setActiveTab(newValue || activeTab)
    }

    return (
        <>
            <BalanceContainer />
            <ToggleButtonGroup
                style={{ maxHeight: 35, flexGrow: 1, width: '100%', marginBottom: 25 }}
                value={activeTab}
                exclusive
                onChange={handleChange}
                aria-label="text alignment"
            >
                <ToggleButton
                    value="1"
                    aria-label="left aligned"
                    style={{
                        backgroundColor: activeTab === '1' ? '#2eae34' : '#263543',
                        color: activeTab === '1' ? 'white' : '#8a939f',
                        flexGrow: 1
                    }}
                >
                    <p>Execute</p>
                </ToggleButton>
                <ToggleButton
                    value="2"
                    aria-label="left aligned"
                    style={{
                        backgroundColor: activeTab === '2' ? '#2eae34' : '#263543',
                        color: activeTab === '2' ? 'white' : '#8a939f',
                        flexGrow: 1
                    }}
                >
                    <p>Open</p>
                </ToggleButton>
                <ToggleButton
                    value="3"
                    aria-label="left aligned"
                    style={{
                        backgroundColor: activeTab === '3' ? '#2eae34' : '#263543',
                        color: activeTab === '3' ? 'white' : '#8a939f',
                        flexGrow: 1
                    }}
                >
                    <p>History</p>
                </ToggleButton>
            </ToggleButtonGroup>
            {
                activeTab === "1" && <TradingActionContainer />
            }
            {
                activeTab === "2" && <OpenTrades />
            }
            {
                activeTab === "3" && <History />
            }
        </>
    )
};

const mapStateToProps = (state: RootState) => ({

})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(ChartContainer)