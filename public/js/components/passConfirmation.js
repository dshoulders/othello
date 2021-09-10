import {
    useSwitchPlayer,
    useCurrentUser,
    useRegisteredPlayers,
    useBoard,
} from '../hooks/utils.js'
import { html, getValidCoords, getPlayerIndex } from '../utils.js'
import modal from './modal.js'

const passConfirmation = ({ currentPlayer }) => {
    const user = useCurrentUser()
    const switchPlayer = useSwitchPlayer()
    const registeredPlayers = useRegisteredPlayers()
    const board = useBoard()

    if (
        user === undefined ||
        currentPlayer === undefined ||
        user.uid !== currentPlayer.uid
    ) {
        return null
    }

    const currentPlayerIndex = getPlayerIndex(
        registeredPlayers,
        currentPlayer.uid
    )
    // const showPassModal = getValidCoords(board, currentPlayerIndex).length === 0
    const showPassModal = false

    if (showPassModal === false) {
        return null
    }

    return html`
        <${modal}>
            <p>
                You do not have any possible moves.
            </p>
            <p>
                Play passes to your opponent.
            </p>
            <button onClick=${switchPlayer}>Ok</button>            
        </${modal}>
    `
}

export default passConfirmation
