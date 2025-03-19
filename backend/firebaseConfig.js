import admin from "firebase-admin";
import dotenv from "dotenv";
import firebaseServiceAccount from "./config/firebaseServiceAccount.json" assert { type: "json" };


dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();
export { admin, db };
