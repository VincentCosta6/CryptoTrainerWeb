import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import DrawerComponent from './DrawerComponent'
import ProfileInfo from './ProfileInfo'

export default () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const closeDrawer = () => setDrawerOpen(false)
    const openDrawer = () => setDrawerOpen(true)

    return (
        <>
            <DrawerComponent open={drawerOpen} onClose={closeDrawer} />
            <header className="main-header">
                <div className="drawer-container" onClick={openDrawer}>
                    <FontAwesomeIcon icon={faBars} />
                </div>
                <h2 className="title">Minecraft Markets</h2>
                <ProfileInfo />
            </header>
        </>
    )
};