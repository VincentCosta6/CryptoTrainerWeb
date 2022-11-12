import { useState } from 'react'

import { RootState } from '../redux/store'
import Person from '@material-ui/icons/Person'

import { useNavigate } from 'react-router-dom'

import { connect, ConnectedProps } from 'react-redux'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

const ProfileInfo = (props: Props) => {
    const navigate = useNavigate()

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

    if (props.user.loading === 'idle') {
        return <p>You are not logged in</p>
    } else if (props.user.loading === 'pending') {
        return <p>Loading...</p>
    } else if (props.user.loading === 'success') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
                <Button aria-controls="simple-menu2" aria-haspopup="true" onClick={handleClick} style = {{ color: '#8a939f' }} endIcon={<Person />}>
                    { props.user.username }
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

const mapStateToProps = (state: RootState) => ({
    user: state.user,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(ProfileInfo)