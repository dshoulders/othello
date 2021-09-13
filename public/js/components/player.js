import { getScore, html } from '../utils.js'

export function playerInfo({ board, player, currentPlayer, index }) {
    return html`<li
        class=${`player ${currentPlayer?.uid === player.uid ? 'active' : ''}`}
    >
        <span class="player-name">${player.name.split(' ')[0]}</span>
        <div class="player-score">${getScore(board, index)}</div>
    </li>`
}
