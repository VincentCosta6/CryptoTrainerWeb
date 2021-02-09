import React, { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import DrawerComponent from './DrawerComponent'
import ProfileInfo from './ProfileInfo'
import { RootState } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'

import ws from '../websocket/cryptoPrice2'
import { setTimeInterval } from '../redux/reducers/price'

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

export const Header = (props: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const closeDrawer = () => setDrawerOpen(false)
    const openDrawer = () => setDrawerOpen(true)
    const [websocket, setWebsocket] = useState<WebSocket | null>(null)
    const [reconnectionTimeout, setReconnectionTimeout] = useState<any>(null)

    useEffect(() => {
        websocket?.send(JSON.stringify({ type: 'changeCrypto', currencyPairId: props.coinMap[props.selectedCrypto].cryptowatchID }))
    }, [props.selectedCrypto])

    useEffect(() => {
        websocket?.send(JSON.stringify({ type: 'changeInterval', interval: props.selectedInterval }))
    }, [props.selectedInterval])

    useEffect(() => {
        if (websocket && props.websocketConnected === 'idle') {
            clearTimeout(reconnectionTimeout)
            setReconnectionTimeout(
                setTimeout(() => {
                    console.log('attempting to reconnect...')
                    setWebsocket(ws(true))
                }, 10000)
            )
        }
    }, [props.websocketConnected])

    useEffect(() => {
        if (props.pricesLoading === 'success' && props.websocketConnected === 'idle') {
            setWebsocket(ws(false))
        }
    }, [props.pricesLoading])

    const websocketColor = websocketColors[props.websocketConnected]
    const websocketText = websocketTexts[props.websocketConnected]

    return (
        <>
            <DrawerComponent open={drawerOpen} onClose={closeDrawer} />
            <header className="main-header">
                <div className="drawer-container" onClick={openDrawer}>
                    <FontAwesomeIcon icon={faBars} />
                    <span className="styled-icon" style = {{ backgroundColor: websocketColor }}></span>
                    <p>{websocketText}</p>
                </div>
                <h2 className="title">Minecraft Markets</h2>
                <ProfileInfo />
            </header>
        </>
    )
};

const mapStateToProps = (state: RootState) => ({
    coinMap: state.coins.map,
    pricesLoading: state.price.loading,
    selectedCrypto: state.coins.selectedCoin,
    selectedInterval: state.price.selectedInterval,
    websocketConnected: state.price.websocketConnected,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(Header)