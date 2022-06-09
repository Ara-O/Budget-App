import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged,createUserWithEmailAndPassword } from "firebase/auth";

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
                resolve(true)
            } else {
                reject("User not found")
            }
        });
    }).catch((err) => { console.log(err); return false })

    let dataReceived = await getInfo;
    return dataReceived
}

export async function registerUser(email, password){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      console.log(user)
    })
    .catch((error) => {
      alert(error.message)
    });
}