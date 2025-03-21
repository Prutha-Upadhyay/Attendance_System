import admin from "firebase-admin";
import dotenv from "dotenv";
// import firebaseServiceAccount from "./config/firebaseServiceAccount.json" assert { type: "json" };


dotenv.config();
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();
export { admin, db };
