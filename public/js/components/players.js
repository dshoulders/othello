import { useState } from '../hooks/lib.js'
import { useRead } from '../hooks/providers/firebase.js'
import { html } from '../utils.js'

export function players({ registeredPlayers, currentPlayerId }) {
    const [board, setBoard] = useState({})

    useRead('/board', (snapshot) => {
        setBoard(snapshot.val())
    })

    const scores = registeredPlayers.map(
        (_, index) =>
            Object.values(board).filter((playerIndex) => playerIndex === index)
                .length
    )

    return html`
        <ul class="players">
            ${registeredPlayers.map(
                (player, index) =>
                    html`<li
                        class=${`${
                            currentPlayerId === player.uid ? 'active' : ''
                        }`}
                    >
                        <img src=${player.avatar} />
                        <span class="player-name"
                            >${player.name.split(' ')[0]}</span
                        >
                        <div class="player-score">
                            <span class="player-score-number"
                                >${scores[index]}</span
                            >
                            <svg class="player-score-graphic" height="15">
                                ${Array(scores[index])
                                    .fill()
                                    .map(
                                        (_, scoreIndex) => html`
                                            <rect
                                                x=${scoreIndex * 10}
                                                y=${0}
                                                height=${15}
                                                width=${4}
                                                fill="white"
                                                stroke="black"
                                                stroke-width="1"
                                            />
                                        `
                                    )}
                            </svg>
                        </div>
                    </li>`
            )}
        </ul>
    `
}
