import { h } from 'https://unpkg.com/preact@latest?module'
import htm from 'https://unpkg.com/htm?module'

// Initialize htm with Preact
export const html = htm.bind(h)
