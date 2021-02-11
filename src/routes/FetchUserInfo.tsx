import React, { useEffect } from 'react';

import { useAppDispatch } from '../redux/store'
import { fetchUserByUUID } from '../redux/reducers/user'
import { fetchUsersCoinsByUUID } from '../redux/reducers/usersCoins'
import { fetchCoinList } from '../redux/reducers/coins'
import { fetchTradeList } from '../redux/reducers/trades'
import { fetchLeveragedTradesList } from '../redux/reducers/leveragedTrade'

import { RootState } from '../redux/store'
import { connect, ConnectedProps } from 'react-redux'

import Dashboard from '../components/Dashboard'

export const FetchUserInfo = (props: Props) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchUserByUUID(props.match.params.hashedUser))
        
        
        dispatch(fetchCoinList())
    }, [props.match.params.hashedUser])

    useEffect(() => {
        if (props.coinsLoading === 'success') {
            dispatch(fetchTradeList({ uuid: props.match.params.hashedUser, coins: props.coins }))
            dispatch(fetchUsersCoinsByUUID({ uuid: props.match.params.hashedUser, coins: props.coins }))
            dispatch(fetchLeveragedTradesList({ uuid: props.match.params.hashedUser, coins: props.coins }))
        }
    }, [props.coinsLoading])

    if (props.userLoading === 'pending') {
        return <p>Loading...</p>
    }

    return (
        <Dashboard />
    )
}

const mapStateToProps = (state: RootState) => ({
    coinsLoading: state.coins.loading,
    coins: state.coins.coins,
    user: state.user,
    userLoading: state.user.loading,
})

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    match: {
        params: {
            hashedUser: string
        }
    }
}

export default connector(FetchUserInfo)