import { useState } from '../hooks/lib.js'
import { useRead } from '../hooks/providers/firebase.js'
import { html } from '../utils.js'
import { columns, SQUARE_SIZE } from './board.js'

export function disc({ col, row }) {
    const [disc, setDisc] = useState(null)

    const colour = disc === 0 ? 'black' : disc === 1 ? 'white' : 'none'

    useRead(`/board/${col}${row}`, (snapshot) => {
        setDisc(snapshot.val())
    })

    if (disc === null) {
        return null
    }

    const xOffset =
        columns.findIndex((c) => c === col) * SQUARE_SIZE + SQUARE_SIZE / 2

    const yOffset = (row - 1) * SQUARE_SIZE + SQUARE_SIZE / 2

    return html` <ellipse
        class=${`disc ${disc === 1 ? 'flipped' : ''}`}
        cx=${xOffset}
        cy=${yOffset}
        rx=${(SQUARE_SIZE / 100) * 40}
        ry=${(SQUARE_SIZE / 100) * 40}
        fill=${colour}
        transform-origin=${`${xOffset} ${yOffset}`}
    />`
}
