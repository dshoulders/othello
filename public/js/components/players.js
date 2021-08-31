import { useState } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module'
import { useFirebase } from '../hooks/providers/firebase.js'
import { html } from '../utils.js'

export function players() {
    const [players, setPlayers] = useState([])
    const firebase = useFirebase()

    const playersRef = firebase
        .database()
        .ref('/players')
        .get()
        .then((snapshot) => {
            const fetchedPlayers = snapshot.val()
            setPlayers(Object.values(fetchedPlayers))
        })

    return html`
        <ul>
            ${players.map((player) => html`<li>${player}</li>`)}
        </ul>
    `
}
