import { html } from '../utils.js'
import { players } from './players.js'
import { board } from './board.js'

export function app() {
    return html`<div>
        <${players} />
        <${board} />
    </div>`
}
