import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


let app, auth;

export function setUpFirebase(thisValue) {
    const apiKey = thisValue.$config.apiKey;
    const authDomain = thisValue.$config.authDomain;
    const databaseURL = thisValue.$config.databaseURL;
    const projectId = thisValue.$config.projectId;
    const storageBucket = thisValue.$config.storageBucket;
    const messagingSenderId = thisValue.$config.messagingSenderId;
    const appId = thisValue.$config.appId;

    const firebaseConfig = {
        apiKey,
        authDomain,
        databaseURL,
        projectId,
        storageBucket,
        messagingSenderId,
        appId
    };

    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
}

export function userIsSignedIn() {
    let getInfo = new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user.uid)
            } else {
                reject("User not found")
            }
        });
    })

    return getInfo
}

export async function registerUser(email, password) {
    try {
        //await returns the fulfilled value of the promise;
        let userCredential = await createUserWithEmailAndPassword(auth, email, password);
        let uid = userCredential.user.uid;
        return uid
    } catch (err) {
        throw err
    }
}

export async function logInUser(email, password, this_value) {
    try {
        let userCredential = await signInWithEmailAndPassword(auth, email, password)
        let uid = userCredential.user.uid;
        return uid
    } catch (err) {
        throw err
    }
}