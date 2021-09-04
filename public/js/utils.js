import {
    h,
    render,
    createContext,
} from 'https://unpkg.com/preact@latest?module'
import htm from 'https://unpkg.com/htm?module'
import { columns, rows } from './components/board.js'

export { render, createContext }

// Initialize htm with Preact
export const html = htm.bind(h)

export function reset() {
    setBoard({
        d4: 1,
        e4: 0,
        d5: 0,
        e5: 1,
    })
    window.firebase.database().ref('/currentPlayerId').set(null)
}

export function setBoard(board) {
    window.firebase.database().ref('/board').set(board)
}

function getCoord(col, row) {
    const colCoord = columns[col]
    const rowCoord = rows[row]

    if (!colCoord || !rowCoord) {
        return null
    }

    return `${colCoord}${rowCoord}`
}

export function getAdjacentCoords(coord) {
    const [col, row] = coord

    const colIndex = columns.indexOf(col)
    const rowIndex = rows.indexOf(Number(row))

    const adjacent = {
        n: getCoord(colIndex, rowIndex - 1),
        ne: getCoord(colIndex + 1, rowIndex - 1),
        e: getCoord(colIndex + 1, rowIndex),
        se: getCoord(colIndex + 1, rowIndex + 1),
        s: getCoord(colIndex, rowIndex + 1),
        sw: getCoord(colIndex - 1, rowIndex + 1),
        w: getCoord(colIndex - 1, rowIndex),
        nw: getCoord(colIndex - 1, rowIndex - 1),
    }

    return adjacent
}

export function isValidCoord(board, playerIndex, coord) {
    const otherPlayerIndex = playerIndex === 0 ? 1 : 0
    const adjacentCoords = getAdjacentCoords(coord)
    return Object.values(adjacentCoords).some(
        (adj) => board[adj] === otherPlayerIndex
    )
}
