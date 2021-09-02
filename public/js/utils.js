import {
    h,
    render,
    createContext,
} from 'https://unpkg.com/preact@latest?module'
import htm from 'https://unpkg.com/htm?module'

export { render, createContext }

// Initialize htm with Preact
export const html = htm.bind(h)
