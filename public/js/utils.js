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

function getCoord(colIndex, rowIndex) {
    const col = columns[colIndex]
    const row = rows[rowIndex]

    if (!col || !row) {
        return null
    }

    return `${col}${row}`
}

export function isValidCoord(board, playerIndex, coord) {
    return ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].some(
        (direction) =>
            scoringCoords(board, playerIndex, direction, coord).length > 0
    )
}

function getAdjacentCoord(coord, direction) {
    const [col, row] = coord

    const colIndex = columns.indexOf(col)
    const rowIndex = rows.indexOf(Number(row))

    switch (direction) {
        case 'n':
            return getCoord(colIndex, rowIndex - 1)
        case 'ne':
            return getCoord(colIndex + 1, rowIndex - 1)
        case 'e':
            return getCoord(colIndex + 1, rowIndex)
        case 'se':
            return getCoord(colIndex + 1, rowIndex + 1)
        case 's':
            return getCoord(colIndex, rowIndex + 1)
        case 'sw':
            return getCoord(colIndex - 1, rowIndex + 1)
        case 'w':
            return getCoord(colIndex - 1, rowIndex)
        case 'nw':
            return getCoord(colIndex - 1, rowIndex - 1)
    }
}

export function scoringCoords(
    board,
    currentPlayerIndex,
    direction,
    coord,
    scores = []
) {
    const adjacentCoord = getAdjacentCoord(coord, direction)
    const valueAtCoord = board[adjacentCoord]

    if (adjacentCoord === null || valueAtCoord === undefined) {
        return []
    }
    if (valueAtCoord === currentPlayerIndex) {
        return scores
    }

    scores.push(adjacentCoord)
    return scoringCoords(
        board,
        currentPlayerIndex,
        direction,
        adjacentCoord,
        scores
    )
}
