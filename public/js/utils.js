import {
    h,
    render,
    createContext,
} from 'https://unpkg.com/preact@latest?module'
import htm from 'https://unpkg.com/htm?module'

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
