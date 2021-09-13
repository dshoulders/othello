import { useDb } from '../hooks/providers/firebase.js'
import {
    useBoard,
    useCurrentPlayer,
    useRegisteredPlayers,
    useSwitchPlayer,
} from '../hooks/utils.js'
import { html } from '../utils.js'
import { playerInfo } from './player.js'

export function players() {
    const currentPlayer = useCurrentPlayer()
    const registeredPlayers = useRegisteredPlayers()
    const [board] = useBoard()
    const db = useDb()

    const showSwitchButton =
        registeredPlayers.length === 2 && currentPlayer === undefined

    function switchPlayers() {
        const playersRef = db.ref('/players')

        playersRef.get().then((snapshot) => {
            const playerList = snapshot.val()
            playersRef.set(playerList.reverse())
        })
    }

    if (!board || registeredPlayers.length < 2) {
        return null
    }

    return html`
        <div class="players">
            <${playerInfo}
                board=${board}
                player=${registeredPlayers[0]}
                index=${0}
                currentPlayer=${currentPlayer}
            />
            ${showSwitchButton &&
            html`<button onClick=${switchPlayers}>Switch Players</button>`}
            <${playerInfo}
                board=${board}
                player=${registeredPlayers[1]}
                index=${1}
                currentPlayer=${currentPlayer}
            />
        </div>
    `
}
