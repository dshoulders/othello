import { html } from '../utils.js'
import { SQUARE_SIZE, columns } from './board.js'

export function square({ col, row }) {
    return html`<rect
        id=${`${col}${row}`}
        x=${columns.findIndex((c) => c === col) * SQUARE_SIZE}
        y=${(row - 1) * SQUARE_SIZE}
        height=${SQUARE_SIZE}
        width=${SQUARE_SIZE}
        fill="transparent"
    />`
}
