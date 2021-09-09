import { html } from '../utils.js'
import { players } from './players.js'
import { board } from './board.js'
import { useDb } from '../hooks/providers/firebase.js'
import {
    useCurrentPlayer,
    useRegisteredPlayers,
    useReset,
} from '../hooks/utils.js'

export function app() {
    const registeredPlayers = useRegisteredPlayers()
    const currentPlayer = useCurrentPlayer()
    const reset = useReset()

    const showPlayButton =
        registeredPlayers.length === 2 && currentPlayer === undefined
    const showResetButton =
        registeredPlayers.length === 2 && currentPlayer !== undefined

    const db = useDb()

    function onPlayClick() {
        db.ref('/currentPlayerId').set(registeredPlayers[0].uid)
    }

    function onResetClick() {
        reset()
    }

    return html`<div>
        <${players} />
        ${showPlayButton && html`<button onClick=${onPlayClick}>Play</button>`}
        ${showResetButton &&
        html`<button onClick=${onResetClick}>Reset</button>`}
        <${board} />
    </div>`
}
