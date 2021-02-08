import React from 'react'

import { RootState } from '../redux/store'

import { connect, ConnectedProps } from 'react-redux'

const ProfileInfo = (props: Props) => {
    if (props.user.loading === 'idle') {
        return <p>You are not logged in</p>
    } else if (props.user.loading === 'pending') {
        return <p>Loading...</p>
    } else if (props.user.loading === 'success') {
        return <p>{props.user.username}</p>
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