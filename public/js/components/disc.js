import {
    useState,
    useEffect,
} from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module'
import { useFirebase } from '../hooks/providers/firebase.js'
import { html } from '../utils.js'
import { SQUARE_SIZE, columns } from './board.js'

export function disc({ col, row }) {
    const [disc, setDisc] = useState(0)
    const firebase = useFirebase()

    const colour = disc === 1 ? 'black' : disc === 2 ? 'white' : 'none'

    useEffect(() => {
        const ref = firebase.database().ref(`/board/${col}${row}`)

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
