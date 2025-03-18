import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCCIY6v-7pHYSJiZ-TC93cUXqs7rCuT8OU",
    authDomain: "attendance-system-8d55e.firebaseapp.com",
    projectId: "attendance-system-8d55e",
    storageBucket: "attendance-system-8d55e.firebasestorage.app",
    messagingSenderId: "185209952950",
    appId: "1:185209952950:web:57f2405a80b2bee30d6417",
    measurementId: "G-N63WHC25XV"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCCIY6v-7pHYSJiZ-TC93cUXqs7rCuT8OU",
//   authDomain: "attendance-system-8d55e.firebaseapp.com",
//   projectId: "attendance-system-8d55e",
//   storageBucket: "attendance-system-8d55e.firebasestorage.app",
//   messagingSenderId: "185209952950",
//   appId: "1:185209952950:web:57f2405a80b2bee30d6417",
//   measurementId: "G-N63WHC25XV"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// project-185209952950