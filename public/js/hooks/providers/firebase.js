import { useContext, useEffect } from '../../hooks/lib.js'
import { html, createContext } from '../../utils.js'

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

const useDb = () => {
    const firebaseContext = useContext(context)
    if (firebaseContext === undefined) {
        throw new Error('useDb must be used within a FirebaseProvider')
    }
    return firebaseContext.database()
}

const useRead = (path, callback) => {
    const firebaseContext = useContext(context)
    if (firebaseContext === undefined) {
        throw new Error('useRead must be used within a FirebaseProvider')
    }
    useEffect(() => {
        const ref = firebaseContext.database().ref(path)
        ref.on('value', callback)

        return () => ref.off('value', callback)
    }, [path])
}

export { firebaseProvider, useFirebase, useDb, useRead }
