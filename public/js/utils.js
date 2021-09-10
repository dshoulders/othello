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

const directons = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

function getCoord(colIndex, rowIndex) {
    const col = columns[colIndex]
    const row = rows[rowIndex]

    if (!col || !row) {
        return null
    }

    return `${col}${row}`
}

export function getScoringCoords(board, playerIndex, coord) {
    return directons.reduce((allScores, direction) => {
        const scores = getScoresOnDirection(
            board,
            playerIndex,
            direction,
            coord
        )

        return [...allScores, ...scores]
    }, [])
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

export function getScoresOnDirection(
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
    return getScoresOnDirection(
        board,
        currentPlayerIndex,
        direction,
        adjacentCoord,
        scores
    )
}

export function getPlayerIndex(registeredPlayers, playerId) {
    return registeredPlayers.findIndex((p) => p.uid === playerId)
}

export function getValidCoords(board, currentPlayerIndex) {
    const validCoords = []

    columns.forEach((col) =>
        rows.forEach((row) =>
            directons.forEach((direction) => {
                const coord = `${col}${row}`

                if (board[coord] === 0 || board[coord] === 1) {
                    return
                }

                const scores = getScoresOnDirection(
                    board,
                    currentPlayerIndex,
                    direction,
                    coord
                )

                if (scores.length > 0) {
                    validCoords.push(coord)
                }
            })
        )
    )
    return validCoords
}
