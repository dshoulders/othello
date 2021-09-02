import { html, render } from './utils.js'
import { signin } from './auth.js'
import { firebaseProvider } from './hooks/providers/firebase.js'
import { userProvider } from './hooks/providers/user.js'
import { app } from './components/app.js'

function init({ rootNode, firebase }) {
    alert('ggg')
    signin(firebase)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken
            // The signed-in user info.
            var user = result.user

            alert(user.email, user.displayName)

            // If there are less than 2 players add the current user as a player
            const playersRef = firebase.database().ref('/players')
            playersRef.get().then((snapshot) => {
                if (snapshot.numChildren() < 2) {
                    firebase
                        .database()
                        .ref(`/players/${user.uid}`)
                        .set(user.displayName)
                }
            })

            console.log('main')

            render(
                html`
                <${firebaseProvider} firebase=${firebase}>
                    <${userProvider} user=${user}>
                        <${app} />
                    </${userProvider}>
                </${firebaseProvider}>`,
                rootNode
            )
        })
        .catch((...args) => alert(args))
}

window.OTHELLO = { init }
