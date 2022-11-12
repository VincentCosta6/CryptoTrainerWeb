import { useState, useEffect, createContext, useMemo, useContext, FunctionComponent } from "react"

const defaultDimensions = {
    width: window.innerWidth,
    height: window.innerHeight,
}

const ScreenDimensionsContext = createContext(defaultDimensions)
const { Provider } = ScreenDimensionsContext

export const ScreenDimensionsProvider: FunctionComponent = ({ children }) => {
    const [dimensions, setDimensions] = useState(() => defaultDimensions)

    useEffect(() => {
        window.addEventListener('resize', updateScreenDimensions)

        return () => window.removeEventListener('resize', updateScreenDimensions)
    }, [])

    const updateScreenDimensions = () => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    }

    const values = useMemo(() => ({
        width: dimensions.width,
        height: dimensions.height,
    }), [dimensions.width, dimensions.height])

    return (
        <Provider value={values}>
            {children}
        </Provider>
    )
}

export const useScreenDimensions = () => {
    const screenContextValues = useContext(ScreenDimensionsContext)

    const dimensions = useMemo(() => ({
        width: screenContextValues.width, 
        height: screenContextValues.height
    }), [screenContextValues.width, screenContextValues.height])

    return dimensions
}