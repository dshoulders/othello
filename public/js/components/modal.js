import { html } from '../utils.js'

const modal = ({ className, children }) => {
    return html`<div class=${`modal ${className}`}>
        <div class="modal-dialog">${children}</div>
    </div>`
}

export default modal
