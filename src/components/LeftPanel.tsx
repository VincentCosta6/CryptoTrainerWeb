import { useState } from 'react'

import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

import BalanceContainer from './BalanceContainer'
import History from './History'
import OpenTrades from './OpenTrades'
import TradingActionContainer from './TradingActionContainer'

import './LeftPanel.scss'

export const ChartContainer = () => {
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

export default ChartContainer