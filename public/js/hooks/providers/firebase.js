import { createContext } from 'https://unpkg.com/preact@latest?module'
import { useContext } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module'
import { html } from '../../utils.js'

const context = createContext(undefined)

const firebaseProvider = ({ firebase, children }) => {
    return html`<${context.Provider} value=${firebase}>${children}</${context.Provider}>`
}

const useFirebase = () => {
    const firebaseContext = useContext(context)
    if (firebaseContext === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider')
    }
    return firebaseContext
}

export { firebaseProvider, useFirebase }
