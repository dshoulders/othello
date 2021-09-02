import { useContext } from '../../hooks/lib.js'
import { html, createContext } from '../../utils.js'

const context = createContext(undefined)

const userProvider = ({ user, children }) => {
    return html`<${context.Provider} value=${user}>${children}</${context.Provider}>`
}

const useUser = () => {
    const userContext = useContext(context)
    if (userContext === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return userContext
}

export { userProvider, useUser }
