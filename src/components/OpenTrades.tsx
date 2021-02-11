import React, { useState, useEffect } from 'react'

import { RootState, useAppDispatch } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LeveragedTrade from './LeveragedTrade'
import OpenTradeView from './OpenTradeView'
import { LeveragedTradeType, removeLeveragedTrade } from '../redux/reducers/leveragedTrade';
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { upColor } from './chartOptions';
import { setDollars } from '../redux/reducers/user';

export const OpenTrades = (props: Props) => {
    const dispatch = useAppDispatch()

    const [tradeChosen, setTradeChosen] = useState<LeveragedTradeType | null>(null)
    const [executionLoading, setExecutionLoading] = useState(false)

    const handleExecution = () => {
        setExecutionLoading(true)
        fetch(`https://api.minecraftmarkets.com/leverage/sell/${props.coinMap[props.selectedCrypto].exchange}/${props.selectedCrypto}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            // @ts-ignore
            body: JSON.stringify({ uuid: props.uuid, priceAtExecution: props.lastPrice, tradeID: tradeChosen?._id })
        })
            .then(res => res.json())
            .then(data => {
                const updateInfo = data.data

                setExecutionLoading(false)
                // @ts-ignore
                dispatch(removeLeveragedTrade(tradeChosen))
                dispatch(setDollars(updateInfo.newDollars))
                setTradeChosen(null)
            })
            .catch(err => {
                setExecutionLoading(false)
                console.log(err)
            })
    }

    return (
        <div>
            <List component="nav" aria-label="main mailbox folders">
                {
                    // @ts-ignore
                    props.leveragedTrades.filter((trade: LeveragedTradeType) => trade.tradeOpen && trade.ticker === props.selectedCrypto).map((trade: LeveragedTradeType) => (
                        <ListItem button key={trade._id} onClick={() => {
                            setTradeChosen(trade)
                        }}>
                            <LeveragedTrade trade={trade} price={props.lastPrice} />
                        </ListItem>
                    ))
                }
            </List>
            <Dialog
                open={Boolean(tradeChosen)}
                onClose={() => {
                    if (!executionLoading)
                        setTradeChosen(null)
                }}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <DialogTitle id="simple-dialog-title">Leveraged Trade View</DialogTitle>
                <DialogContent>
                    <OpenTradeView trade={tradeChosen} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        if (!executionLoading) 
                            setTradeChosen(null)
                    }} color="primary">
                        Back
                    </Button>
                    <Button onClick={handleExecution} color="primary" autoFocus disabled={executionLoading || !tradeChosen}>
                        Close Position
                    </Button>
                </DialogActions>
            </Dialog >
        </div>
    )
};

const mapStateToProps = (state: RootState) => ({
    coinMap: state.coins.map,
    uuid: state.user.uuid,
    lastPrice: state.price.lastPrice,
    leveragedTrades: state.leveragedTrades.leveragedTrades,
    leverageLoading: state.leveragedTrades.loading,
    selectedCrypto: state.coins.selectedCoin,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {

}

export default connector(OpenTrades)