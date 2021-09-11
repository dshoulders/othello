import {
    useCurrentUser,
    useRegisteredPlayers,
    useBoard,
    useReset,
} from '../hooks/utils.js'
import { html, getValidCoords, getPlayerIndex, getScore } from '../utils.js'
import modal from './modal.js'

const winConfirmation = ({ currentPlayer }) => {
    const user = useCurrentUser()
    const reset = useReset()
    const registeredPlayers = useRegisteredPlayers()
    const [board] = useBoard()

    if (user === undefined || currentPlayer === undefined || board === null) {
        return null
    }

    const currentPlayerIndex = getPlayerIndex(
        registeredPlayers,
        currentPlayer.uid
    )

    const otherPlayerIndex = currentPlayerIndex === 0 ? 1 : 0

    const showWinModal =
        getValidCoords(board, currentPlayerIndex).length === 0 &&
        getValidCoords(board, otherPlayerIndex).length === 0

    const winner = registeredPlayers
        .map((player, index) => {
            return {
                score: getScore(board, index),
                name: player.name,
                uid: player.uid,
            }
        })
        .reduce((top, playerScore) => {
            if (!top || playerScore.score > top.score) {
                return playerScore
            }
            return top
        })

    const message =
        winner.uid === user.uid
            ? 'You win!'
            : `${winner.name.split(' ')[0]} wins!`

    if (showWinModal === false) {
        return null
    }

    return html`
        <${modal} className="winner-confirmation">
            <h2>
                ${message}
            </h2>
            <button onClick=${reset}>Reset</button>            
        </${modal}>
    `
}

export default winConfirmation
