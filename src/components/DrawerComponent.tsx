import React from 'react'

import { RootState } from '../redux/store'

import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import { connect, ConnectedProps } from 'react-redux'
import { useAppDispatch } from '../redux/store'
import { setSelectedCoin } from '../redux/reducers/coins'

const ProfileInfo = (props: Props) => {
    const dispatch = useAppDispatch()

    return (
        <Drawer anchor="left" open={props.open} onClose={props.onClose}>
            <List>
                {
                    props.coins.map(coin => 
                        <ListItem key={coin} button onClick={() => dispatch(setSelectedCoin(coin))}>
                            <i className={`fab fa-${props.coinMap[coin].name} space-right`}></i>
                            <ListItemText primary={props.coinMap[coin].name} />
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