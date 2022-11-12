import { FC } from 'react'

import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import { Icon, InlineIcon } from '@iconify/react';
import bitcoinIcon from '@iconify-icons/logos/bitcoin';
import ethereumIcon from '@iconify-icons/logos/ethereum';
import dogeIcon from '@iconify-icons/cryptocurrency/doge';

import { nameMap } from './BalanceContainer'

import { setSelectedCoin } from '../redux/reducers/coins'

import { useAppDispatch } from '../redux/store'
import { useCoinMap, useCoins } from '../redux/selectors/coinSelectors'

import './DrawerComponent.scss'

export const coinIconMap = {
    'btcusd': <span className="iconify" data-icon="logos:bitcoin" data-inline="false"></span>,
    'ethusd': <span className="iconify" data-icon="logos:ethereum" data-inline="false"></span>,
    'dogeusdt':<span className="iconify" data-icon="cryptocurrency:doge" data-inline="false" style={{ color: '#c3a636' }}></span>
}

export const CoinIcon = ({ name }: { name: string }) => {
    if (name === 'btcusd') {
        return <Icon icon={bitcoinIcon} width="2.6em" height="2.6em" />
    } else if (name === 'ethusd') {
        return <Icon icon={ethereumIcon} width="2.6em" height="2.6em" />
    } else {
        return <Icon icon={dogeIcon} color="#c3a636" width="2.6em" height="2.6em" />
    }
}

interface DrawerComponentProps {
    open: boolean,
    onClose: any,
}
const DrawerComponent: FC<DrawerComponentProps> = ({
    open,
    onClose,
}) => {
    const dispatch = useAppDispatch()

    const coins = useCoins()
    const coinMap = useCoinMap()

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <List>
                {
                    coins.map(coin => 
                        <ListItem key={coin} button onClick={() => dispatch(setSelectedCoin(coin))}>
                            { /* @ts-ignore */ }
                            { coinIconMap[coin] }
                            <div style={{ marginLeft: 5 }}>
                                <ListItemText primary={nameMap[coinMap[coin].name]} />
                            </div>
                        </ListItem>
                    )
                }
            </List>
        </Drawer>
    )
}

export default DrawerComponent
