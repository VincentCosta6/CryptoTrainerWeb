import React from 'react'

import { RootState } from '../redux/store'

import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import { connect, ConnectedProps } from 'react-redux'
import { useAppDispatch } from '../redux/store'
import { setSelectedCoin } from '../redux/reducers/coins'
import { nameMap } from './BalanceContainer'
import { Icon, InlineIcon } from '@iconify/react';
import bitcoinIcon from '@iconify-icons/logos/bitcoin';
import ethereumIcon from '@iconify-icons/logos/ethereum';
import dogeIcon from '@iconify-icons/cryptocurrency/doge';


import './DrawerComponent.scss'

export const coinIconMap = {
    'btcusd': <span className="iconify" data-icon="logos:bitcoin" data-inline="false"></span>,
    'ethusd': <span className="iconify" data-icon="logos:ethereum" data-inline="false"></span>,
    'dogeusdt':<span className="iconify" data-icon="cryptocurrency:doge" data-inline="false" style={{ color: '#c3a636' }}></span>
}

export const CoinIcon = ({ name }: { name: string }) => {
    if (name === 'btcusd') {
        return <Icon icon={bitcoinIcon} width="2em" height="2em" />
    } else if (name === 'ethusd') {
        return <Icon icon={ethereumIcon} width="2em" height="2em" />
    } else {
        return <Icon icon={dogeIcon} color="#c3a636" width="2em" height="2em" />
    }
}
// npm install --save-dev @iconify/react @iconify-icons/logos



const ProfileInfo = (props: Props) => {
    const dispatch = useAppDispatch()

    return (
        <Drawer anchor="left" open={props.open} onClose={props.onClose}>
            <List>
                {
                    props.coins.map(coin => 
                        <ListItem key={coin} button onClick={() => dispatch(setSelectedCoin(coin))}>
                            { /* @ts-ignore */ }
                            { coinIconMap[coin] }
                            <div style={{ marginLeft: 5 }}>
                                <ListItemText primary={nameMap[props.coinMap[coin].name]} />
                            </div>
                        </ListItem>
                    )
                }
            </List>
        </Drawer>
    )
}

const mapStateToProps = (state: RootState) => ({
    user: state.user,
    coins: state.coins.coins,
    coinMap: state.coins.map,
    selectedCoin: state.coins.selectedCoin,
})

const connector = connect(mapStateToProps)
type PropFromRedux = ConnectedProps<typeof connector>

type Props = PropFromRedux & {
    open: boolean,
    onClose: any,
}

export default connector(ProfileInfo)