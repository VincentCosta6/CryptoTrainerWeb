import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import DrawerComponent from './DrawerComponent'
import ProfileInfo from './ProfileInfo'
import { RootState } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'

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
    websocketConnected: state.price.websocketConnected,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(Header)