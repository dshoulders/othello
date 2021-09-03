import { html, reset } from '../utils.js'
import { players } from './players.js'
import { board } from './board.js'
import { useDb, useRead } from '../hooks/providers/firebase.js'
import { useState } from '../hooks/lib.js'

export function app() {
    const [registeredPlayers, setRegisteredPlayers] = useState([])
    const [currentPlayerId, setCurrentPlayerId] = useState(null)

    const showPlayButton =
        registeredPlayers.length === 2 && currentPlayerId === null
    const showResetButton =
        registeredPlayers.length === 2 && currentPlayerId !== null

    console.log('app')

    const db = useDb()

    function onPlayClick() {
        db.ref('/currentPlayerId').set(registeredPlayers[0].uid)
    }

    function onResetClick() {
        reset()
    }

    useRead('/players', (snapshot) => {
        const val = snapshot.val()
        const playersList = val
            ? Object.entries(val).map(([key, val]) => ({
                  uid: key,
                  name: val,
              }))
            : []
        setRegisteredPlayers(playersList)
    })

    useRead('/currentPlayerId', (snapshot) => {
        setCurrentPlayerId(snapshot.val())
    })

    return html`<div>
        <${players}
            registeredPlayers=${registeredPlayers}
            currentPlayerId=${currentPlayerId}
        />
        ${showPlayButton && html`<button onClick=${onPlayClick}>Play</button>`}
        ${showResetButton &&
        html`<button onClick=${onResetClick}>Reset</button>`}
        <${board}
            registeredPlayers=${registeredPlayers}
            currentPlayerId=${currentPlayerId}
        />
    </div>`
}
