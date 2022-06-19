import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function userIsSignedIn() {
    let getInfo = new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user)
            } else {
                reject("User not found")
            }
        });
    }).catch((err) => { console.log(err); return false })

    let dataReceived = await getInfo;
    return dataReceived
}

export async function registerUser(email, password) {
    try {
        //await returns the fulfilled value of the promise;
        let userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(userCredential)
    } catch (err) {
        alert(err)
    }

}

export async function logInUser(email, password) {
    try {
        let userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;

    } catch (error) {
        alert(error)
    }


}

export async function addIncome(email, password) {
    //! First get user ID!
    // const db = getDatabase();
    // set(ref(db, 'users/' + userId), {
    //   password: name,
    //   email: email,
    // });
}