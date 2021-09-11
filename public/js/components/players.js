import { useState } from '../hooks/lib.js'
import { useRead } from '../hooks/providers/firebase.js'
import { useCurrentPlayer, useRegisteredPlayers } from '../hooks/utils.js'
import { html, getScore } from '../utils.js'

export function players() {
    const currentPlayer = useCurrentPlayer()
    const registeredPlayers = useRegisteredPlayers()

    const [board, setBoard] = useState({})

    useRead('/board', (snapshot) => {
        setBoard(snapshot.val())
    })

    return html`
        <ul class="players">
            ${registeredPlayers.map(
                (player, index) =>
                    html`<li
                        class=${`player ${
                            currentPlayer?.uid === player.uid ? 'active' : ''
                        }`}
                    >
                        <img src=${player.avatar} />
                        <span class="player-name"
                            >${player.name.split(' ')[0]}</span
                        >
                        <div class="player-score">
                            ${getScore(board, index)}
                        </div>
                    </li>`
            )}
        </ul>
    `
}
