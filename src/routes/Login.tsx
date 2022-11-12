import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { 
    TextField, 
    Button, 
    Theme, 
    CircularProgress,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@material-ui/core'

import {
    makeStyles, 
    createStyles, 
} from '@material-ui/core'

import './Homepage.scss'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        input: {
            flex: 1,
            backgroundColor: '#121d27',
            marginBottom: 25,
            marginLeft: 0,
            color: 'white'
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
        tip: {
            color: 'white',
            margin: 0
        },
        title: {
            color: 'white',
            marginBottom: 50
        },
        signup: {
            color: 'white',
            margin: '20px 0px'
        },
        generate: {
            marginLeft: '10px'
        },
        error: {
            color: 'red'
        }
    }),
);

export default () => {
    const navigate = useNavigate()
    const classes = useStyles();

    const [UUID, setUUID] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')

    const [modalVisible, setModalVisible] = useState(false)
    const [username, setUsername] = useState('')
    const [modalLoading, setModalLoading] = useState(false)
    const [errorModal, setErrorModal] = useState('')

    const handleUUIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUUID(event.target.value)
    }

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const handleLogin = async () => {
        setError('')
        setLoading(true)
        const response = await (await fetch(`https://api.minecraftmarkets.com/user/${UUID}`)).json();
        setLoading(false)

        if (!response.user) {
            setError('UUID not found')
            return
        }

        setError('')
        navigate(`/user/${UUID}`)
    }

    const handleGenerateAccount = () => {
        setModalVisible(true)
    }

    const resetModalForm = () => {
        setModalVisible(false)
        setUsername('')
        setModalLoading(false)
        setErrorModal('')
    }

    const handleCreateUser = async () => {
        setModalLoading(true)
        setErrorModal('')

        const response = await (await fetch(`https://api.minecraftmarkets.com/user/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username }),
        })).json();

        setModalLoading(false)

        if (response.status === 'error') {
            setErrorModal(response.message)
            return
        }

        navigate(`/user/${response.uuid}`)
    }

    return (
        <div className="homepage-body">
            <div className="login-container">
                <div className="form-container">
                    <h2 className={classes.title}>Login</h2>
                    <TextField className={classes.input} label = "UUID" value = {UUID} onChange={handleUUIDChange} />

                    <Button variant="contained"  color="primary" onClick={handleLogin} disabled={loading}>
                        Login
                    </Button>

                    { loading && <LinearProgress /> }

                    { error && <p className={classes.error}>{error}</p> }

                    <span className={classes.signup}>
                        Dont have a UUID?
                        <Button color="primary" onClick={handleGenerateAccount} className={classes.generate}>
                            Generate UUID
                        </Button>
                    </span>
                    <p className={classes.tip}>Tip: After logging in / generating an account make sure you bookmark the page</p>
                </div>
            </div>
            <Dialog
                open={modalVisible}
                onClose={resetModalForm}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                style={{ color: '#8a939e' }}
            >
                <DialogTitle style={{ backgroundColor: '#262d34', color: '#8a939e' }}>Create Account</DialogTitle>
                <DialogContent style={{ backgroundColor: '#262d34' }}>
                    <DialogContentText style={{ color: 'white' }}>Tip: bookmark the page after logging into your account so you can come back later</DialogContentText>
                    <TextField label="Username" value={username} onChange={handleUsernameChange} />
                </DialogContent>
                <DialogActions style={{ backgroundColor: '#262d34' }}>
                    <Button onClick={resetModalForm} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateUser} color="primary" disabled={modalLoading}>
                        {
                            modalLoading ? <CircularProgress /> : 'Create'
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}