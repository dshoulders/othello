import { h, Component, render } from 'https://unpkg.com/preact@latest?module'
import {
    useState,
    useEffect,
} from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module'
import htm from 'https://unpkg.com/htm?module'

import { signin } from './auth.js'

// Initialize htm with Preact
const html = htm.bind(h)

const SQUARE_SIZE = 100
const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const rows = [1, 2, 3, 4, 5, 6, 7, 8]

function init({ rootNode, firebase }) {
    signin(firebase).then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken
        // The signed-in user info.
        var user = result.user

        const playersRef = firebase.database().ref('/players')

        playersRef.get().then((snapshot) => {
            if (snapshot.numChildren() < 2) {
                firebase
                    .database()
                    .ref(`/players/${user.uid}`)
                    .set(user.displayName)
            }
        })

        render(
            html`<${App} database=${firebase.database()} user="{user}" />`,
            rootNode
        )
    })
}

function App({ database, user }) {
    return html`<div>
        <${Players} database=${database} />
        <${Board} database=${database} />
    </div>`
}

function Players() {
    const [players, setPlayers] = useState([])

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

function Board({ database }) {
    return html`
        <svg
            viewBox=${`0 0 ${8 * SQUARE_SIZE} ${8 * SQUARE_SIZE}`}
            style="background: #295a2b;"
        >
            ${[1, 2, 3, 4, 5, 6, 7].map(
                (point) => html` <line
                    x1=${point * SQUARE_SIZE}
                    y1="0"
                    x2=${point * SQUARE_SIZE}
                    y2=${8 * SQUARE_SIZE}
                    stroke="black"
                />`
            )}
            ${[1, 2, 3, 4, 5, 6, 7].map(
                (point) => html` <line
                    x1="0"
                    y1=${point * SQUARE_SIZE}
                    x2=${8 * SQUARE_SIZE}
                    y2=${point * SQUARE_SIZE}
                    stroke="black"
                />`
            )}
            ${columns.map((col) =>
                rows.map(
                    (row) =>
                        html` <${Disc}
                            col=${col}
                            row=${row}
                            database=${database}
                        />`
                )
            )}
            ${columns.map((col) =>
                rows.map(
                    (row) => html` <${Square}
                        col=${col}
                        row=${row}
                        database=${database}
                    />`
                )
            )}
        </svg>
    `
}

function Square({ col, row, database }) {
    return html` <rect
        x=${columns.findIndex((c) => c === col) * SQUARE_SIZE}
        y=${(row - 1) * SQUARE_SIZE}
        height=${SQUARE_SIZE}
        width=${SQUARE_SIZE}
        fill="none"
    />`
}

function Disc({ col, row, database }) {
    const [disc, setDisc] = useState(0)

    const colour = disc === 1 ? 'black' : disc === 2 ? 'white' : 'none'

    useEffect(() => {
        const ref = database.ref(`/board/${col}${row}`)

        function updateDisc(snapshot) {
            setDisc(snapshot.val())
        }

        ref.get().then(updateDisc)

        ref.on('value', updateDisc)

        return () => ref.on('value', updateDisc)
    }, [])

    return html` <circle
        cx=${columns.findIndex((c) => c === col) * SQUARE_SIZE +
        SQUARE_SIZE / 2}
        cy=${(row - 1) * SQUARE_SIZE + SQUARE_SIZE / 2}
        r=${(SQUARE_SIZE / 100) * 40}
        fill=${colour}
    />`
}

window.OTHELLO = { init }
