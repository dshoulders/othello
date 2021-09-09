import { html } from '../utils.js'
import modal from './modal.js'

const passConfirmation = ({ currentPlayerId }) => {
    const showPassModal = validCoords().length

    return html`<${modal}>
        <p>
            You do not have any possible moves. Play passes to your opponent.
        </p>
        <button onClick=${}>Ok</button>
        
    </${modal}>`
}

export default passConfirmation
