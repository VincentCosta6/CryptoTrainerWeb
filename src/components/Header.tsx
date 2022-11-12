import { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import DrawerComponent from './DrawerComponent'
import ProfileInfo from './ProfileInfo'

import { usePriceLoading, useSelectedInterval, useWebsocketConnected } from '../redux/selectors/priceSelectors'
import { useCoinMap, useSelectedCoin } from '../redux/selectors/coinSelectors'

import ws from '../websocket/cryptoPrice2'

const websocketColors = {
    'idle': 'grey',
    'pending': 'yellow',
    'success': 'rgb(123, 238, 91)',
    'error': 'red'
}
const websocketTexts = {
    'idle': 'Not connected',
    'pending': 'Connecting',
    'success': 'Connected',
    'error': 'Error connecting'
}

export const Header = () => {
    const pricesLoading = usePriceLoading()
    const websocketConnected = useWebsocketConnected()

    const coinMap = useCoinMap()
    const selectedCrypto = useSelectedCoin()
    const selectedInterval = useSelectedInterval()

    const [drawerOpen, setDrawerOpen] = useState(false)
    const closeDrawer = () => setDrawerOpen(false)
    const openDrawer = () => setDrawerOpen(true)
    const [websocket, setWebsocket] = useState<WebSocket | null>(null)
    const [reconnectionTimeout, setReconnectionTimeout] = useState<any>(null)

    useEffect(() => {
        websocket?.send(JSON.stringify({ type: 'changeCrypto', currencyPairId: coinMap[selectedCrypto].cryptowatchID }))
    }, [selectedCrypto])

    useEffect(() => {
        websocket?.send(JSON.stringify({ type: 'changeInterval', interval: selectedInterval }))
    }, [selectedInterval])

    useEffect(() => {
        if (websocket && websocketConnected === 'idle') {
            clearTimeout(reconnectionTimeout)
            setReconnectionTimeout(
                setTimeout(() => {
                    console.log('attempting to reconnect...')
                    setWebsocket(ws(true))
                }, 10000)
            )
        }
    }, [websocketConnected])

    useEffect(() => {
        if (pricesLoading === 'success' && websocketConnected === 'idle') {
            setWebsocket(ws(false))
        }
    }, [pricesLoading])

    const websocketColor = websocketColors[websocketConnected]
    const websocketText = websocketTexts[websocketConnected]

    return (
        <>
            <DrawerComponent open={drawerOpen} onClose={closeDrawer} />
            <header className="main-header">
                <div className="drawer-container" onClick={openDrawer}>
                    <FontAwesomeIcon icon={faBars as any} />
                    <span className="styled-icon" style = {{ backgroundColor: websocketColor }}></span>
                    <p>{websocketText}</p>
                </div>
                <h2 className="title">Crypto Trainer</h2>
                <ProfileInfo />
            </header>
        </>
    )
};

export default Header
