import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// dotenv.config()
// import express from 'express'
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