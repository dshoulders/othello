import { html } from '../utils.js'

export function players({ registeredPlayers, currentPlayerId }) {
    return html`
        <ul class="players">
            ${registeredPlayers.map(
                (player) =>
                    html`<li
                        class=${`${
                            currentPlayerId === player.uid ? 'active' : ''
                        }`}
                    >
                        ${player.name}
                    </li>`
            )}
        </ul>
    `
}
