import React, { useState } from 'react'

import { RootState } from '../redux/store'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Person from '@material-ui/icons/Person';

import Select from '@material-ui/core/Select';

import { connect, ConnectedProps, useStore } from 'react-redux'
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const ProfileInfo = (props: Props) => {
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    if (props.user.loading === 'idle') {
        return <p>You are not logged in</p>
    } else if (props.user.loading === 'pending') {
        return <p>Loading...</p>
    } else if (props.user.loading === 'success') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
                <Button aria-controls="simple-menu2" aria-haspopup="true" onClick={handleClick} style = {{ color: '#8a939f' }} endIcon={<Person />}>
                    Profile
                </Button>
                <Menu
                    id="simple-menu2"
                    keepMounted
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Generate QR code</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>
            </div>
        )
    } else {
        return <p>Error</p>
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.user,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(ProfileInfo)