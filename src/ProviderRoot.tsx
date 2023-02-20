import { FunctionComponent } from "react"

import { Provider as ReduxProvider } from 'react-redux'
import { ScreenDimensionsProvider } from './context/ScreenDimensions'

import store from './redux/store'

export const ProviderRoot: FunctionComponent = ({ children }) => (
    <div className="App">
        <ReduxProvider store={store}>
            <ScreenDimensionsProvider>
                {children}
            </ScreenDimensionsProvider>
        </ReduxProvider>
    </div>
)

export default ProviderRoot
