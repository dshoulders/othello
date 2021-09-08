import { useEffect, useState } from '../hooks/lib.js'
import { useFirebase, useRead } from '../hooks/providers/firebase.js'
import { html, getScoringCoords } from '../utils.js'
import { disc } from './disc.js'
import { square } from './square.js'

export const SQUARE_SIZE = 100
export const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
export const rows = [1, 2, 3, 4, 5, 6, 7, 8]

export function board({ registeredPlayers, currentPlayerId }) {
    console.log('board')

    const [user, setUser] = useState(null)

    const firebase = useFirebase()

    async function tryMove(coord) {
        const boardRef = firebase.database().ref('/board')

        const playerIndex = registeredPlayers.findIndex(
            (p) => p.uid === user.uid
        )

        const otherPlayerIndex = playerIndex === 0 ? 1 : 0
        const otherPlayerId = registeredPlayers[otherPlayerIndex].uid

        const boardSnapshot = await boardRef.get()
        const boardState = boardSnapshot.val()

        const scoringCoords = getScoringCoords(boardState, playerIndex, coord)

        if (scoringCoords.length) {
            scoringCoords.forEach((scoringCoord) => {
                boardState[scoringCoord] = playerIndex
            })
            boardState[coord] = playerIndex
            boardRef.set(boardState)

            firebase.database().ref('/currentPlayerId').set(otherPlayerId)
        }
    }

    async function onClick({ target: { id: coord } }) {
        if (user.uid === currentPlayerId) {
            tryMove(coord)
        }
    }

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(setUser)
        return unsubscribe
    }, [])

    return html`
        <svg
            viewBox=${`0 0 ${8 * SQUARE_SIZE} ${8 * SQUARE_SIZE}`}
            style="background: #295a2b;"
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
