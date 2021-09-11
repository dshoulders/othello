import { useFirebase } from '../hooks/providers/firebase.js'
import {
    useCurrentUser,
    useCurrentPlayer,
    useOtherPlayer,
    useRegisteredPlayers,
    useBoard,
} from '../hooks/utils.js'
import {
    html,
    getScoringCoords,
    getPlayerIndex,
    isEmptyCoord,
} from '../utils.js'
import { disc } from './disc.js'
import { square } from './square.js'

export const SQUARE_SIZE = 100
export const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
export const rows = [1, 2, 3, 4, 5, 6, 7, 8]

export function board() {
    const currentPlayer = useCurrentPlayer()
    const otherPlayer = useOtherPlayer()
    const registeredPlayers = useRegisteredPlayers()
    const [boardState, setBoard] = useBoard()
    const user = useCurrentUser()

    const firebase = useFirebase()

    async function tryMove(coord) {
        if (!isEmptyCoord(boardState, coord)) {
            return
        }

        const playerIndex = getPlayerIndex(registeredPlayers, user.uid)
        const scoringCoords = getScoringCoords(boardState, playerIndex, coord)

        if (scoringCoords.length) {
            scoringCoords.forEach((scoringCoord) => {
                boardState[scoringCoord] = playerIndex
            })
            boardState[coord] = playerIndex
            setBoard(boardState)

            firebase.database().ref('/currentPlayerId').set(otherPlayer.uid)
        }
    }

    async function onClick({ target: { id: coord } }) {
        if (user.uid === currentPlayer?.uid) {
            tryMove(coord)
        }
    }

    return html`
        <svg
            viewBox=${`0 0 ${8 * SQUARE_SIZE} ${8 * SQUARE_SIZE}`}
            class="board"
            onClick=${onClick}
        >
            ${[1, 2, 3, 4, 5, 6, 7].map(
                (point) => html` <line
                    x1=${point * SQUARE_SIZE}
                    y1="0"
                    x2=${point * SQUARE_SIZE}
                    y2=${8 * SQUARE_SIZE}
                    stroke="black"
                />`
            )}
            ${[1, 2, 3, 4, 5, 6, 7].map(
                (point) => html` <line
                    x1="0"
                    y1=${point * SQUARE_SIZE}
                    x2=${8 * SQUARE_SIZE}
                    y2=${point * SQUARE_SIZE}
                    stroke="black"
                />`
            )}
            ${columns.map((col) =>
                rows.map((row) => html` <${disc} col=${col} row=${row} />`)
            )}
            ${columns.map((col) =>
                rows.map((row) => html` <${square} col=${col} row=${row} />`)
            )}
        </svg>
    `
}
