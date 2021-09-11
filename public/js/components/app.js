import { html } from '../utils.js'
import { players } from './players.js'
import { board } from './board.js'
import { useDb } from '../hooks/providers/firebase.js'
import {
    useCurrentPlayer,
    useRegisteredPlayers,
    useReset,
} from '../hooks/utils.js'
import passConfirmation from './passConfirmation.js'
import winConfirmation from './winConfirmation.js'

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

    return html`
        <div>
            <div class="text-box">
                <h1>Othello</h1>
                <h1>Othello</h1>
            </div>
            <${players} />
            ${showPlayButton &&
            html`<button class="board-play" onClick=${onPlayClick}>
                Play
            </button>`}
            <${board} />
            ${showResetButton &&
            html`<button class="board-reset" onClick=${onResetClick}>
                Reset
            </button>`}
            <${passConfirmation} currentPlayer=${currentPlayer} />
            <${winConfirmation} currentPlayer=${currentPlayer} />
        </div>
    `
}
