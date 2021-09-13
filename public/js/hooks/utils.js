import { useEffect, useState } from './lib.js'
import { useDb, useRead } from './providers/firebase.js'

export function useRegisteredPlayers() {
    const [registeredPlayers, setRegisteredPlayers] = useState([])

    useRead('/players', (snapshot) => {
        setRegisteredPlayers(snapshot.val() ?? [])
    })

    return registeredPlayers
}

export function useCurrentPlayer() {
    const registeredPlayers = useRegisteredPlayers()
    const [currentPlayerId, setCurrentPlayerId] = useState(null)

    useRead('/currentPlayerId', (snapshot) => {
        setCurrentPlayerId(snapshot.val())
    })

    return registeredPlayers.find((p) => p.uid === currentPlayerId)
}

export function useOtherPlayer() {
    const registeredPlayers = useRegisteredPlayers()
    const currentPlayer = useCurrentPlayer()
    if (currentPlayer === undefined) {
        return undefined
    }
    return registeredPlayers.find((p) => p.uid !== currentPlayer.uid)
}

export function useSwitchPlayer() {
    const db = useDb()
    const otherPlayer = useOtherPlayer()

    return () => {
        db.ref('/currentPlayerId').set(otherPlayer.uid)
    }
}

export function useBoard() {
    const db = useDb()
    const [board, setBoard] = useState(null)

    const updateBoard = (value) => db.ref('/board').set(value)

    useRead('/board', (snapshot) => setBoard(snapshot.val()))

    return [board, updateBoard]
}

export function useReset() {
    const db = useDb()
    const newBoard = {
        d4: 1,
        e4: 0,
        d5: 0,
        e5: 1,
    }

    return () => {
        db.ref('/currentPlayerId').set(null)
        db.ref('/board').set(newBoard)
    }
}

export function useCurrentUser() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(setUser)
        return unsubscribe
    }, [])

    return user
}
