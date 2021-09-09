import { html } from '../utils.js'

const modal = ({ children }) => {
    return html`<div class="modal">
        <div class="modal-dialog">${children}</div>
    </div>`
}

export default modal
