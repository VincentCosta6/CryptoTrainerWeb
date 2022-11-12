import { useState } from 'react'

import Person from '@material-ui/icons/Person'

import { useNavigate } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

import { useUserLoading, useUsername } from '../redux/selectors/userSelectors'

const ProfileInfo = () => {
    const navigate = useNavigate()

    const userLoading = useUserLoading()
    const username = useUsername()

    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleLogout = () => {
        navigate('/user')
    }

    if (userLoading === 'idle') {
        return <p>You are not logged in</p>
    } else if (userLoading === 'pending') {
        return <p>Loading...</p>
    } else if (userLoading === 'success') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
                <Button aria-controls="simple-menu2" aria-haspopup="true" onClick={handleClick} style = {{ color: '#8a939f' }} endIcon={<Person />}>
                    { username }
                </Button>
                <Menu
                    id="simple-menu2"
                    keepMounted
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Generate QR code</MenuItem>
                </Menu>
            </div>
        )
    } else {
        return <p>Error</p>
    }
}

export default ProfileInfo
