// import React, { useEffect, useState } from "react";
// import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "./firebaseConfig";
// import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [attendanceMarked, setAttendanceMarked] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   const signInWithGoogle = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       setUser(result.user);
//     } catch (error) {
//       console.error("Google Sign-In Error:", error);
//     }
//   };

//   const handleSignOut = async () => {
//     await signOut(auth);
//     setUser(null);
//   };

//   const markAttendance = async () => {
//     if (!user) return;
//     const attendanceRef = collection(db, "attendance");
//     const q = query(attendanceRef, where("email", "==", user.email));
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       alert("Attendance already marked today!");
//       return;
//     }

//     await addDoc(attendanceRef, {
//       name: user.displayName,
//       email: user.email,
//       timestamp: new Date(),
//     });
//     setAttendanceMarked(true);
//     alert("Attendance marked successfully!");
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       {!user ? (
//         <button onClick={signInWithGoogle}>Sign in with Google</button>
//       ) : (
//         <div>
//           <h2>Welcome, {user.displayName}</h2>
//           <img src={user.photoURL} alt="Profile" width="80" />
//           <button onClick={markAttendance} disabled={attendanceMarked}>
//             {attendanceMarked ? "Attendance Marked" : "Mark Attendance"}
//           </button>
//           <button onClick={handleSignOut}>Sign Out</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
// // import React, { useEffect, useState } from "react";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
// // import { auth, db } from "./firebaseConfig";
// // import { collection, addDoc } from "firebase/firestore";
// // import QRCode from "qrcode.react";
// // import TeacherDashboard from "./TeacherDashboard";
// // import QRScanner from "./QRScanner";

// // const Home = () => {
// //   const [user, setUser] = useState(null);
// //   const [qrCodeData, setQrCodeData] = useState("");
// //   const [attendanceMarked, setAttendanceMarked] = useState(false);

// //   const provider = new GoogleAuthProvider();

// //   // Handle Google Login
// //   const handleLogin = async () => {
// //     try {
// //       const result = await signInWithPopup(auth, provider);
// //       setUser(result.user);
// //     } catch (error) {
// //       console.error("Login Error:", error.message);
// //     }
// //   };

// //   // Handle Logout
// //   const handleLogout = async () => {
// //     try {
// //       await signOut(auth);
// //       setUser(null);
// //       setQrCodeData("");
// //       setAttendanceMarked(false);
// //     } catch (error) {
// //       console.error("Logout Error:", error.message);
// //     }
// //   };

// //   // Generate QR Code
// //   const generateQRCode = () => {
// //     if (user) {
// //       const qrData = JSON.stringify({ uid: user.uid, email: user.email, time: new Date().toISOString() });
// //       setQrCodeData(qrData);
// //     }
// //   };

// //   // Mark Attendance
// //   const markAttendance = async () => {
// //     if (!user) return;
// //     try {
// //       await addDoc(collection(db, "attendance"), {
// //         uid: user.uid,
// //         email: user.email,
// //         timestamp: new Date(),
// //       });
// //       setAttendanceMarked(true);
// //       alert("Attendance marked successfully!");
// //     } catch (error) {
// //       console.error("Error marking attendance:", error.message);
// //     }
// //   };

// //   // Track Auth State
// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
// //       setUser(currentUser);
// //     });
// //     return () => unsubscribe();
// //   }, []);

// //   return (
// //     <div className="container">
// //       <h1>QR Code Attendance System</h1>
// //       {user ? (
// //         <>
// //           <h3>Welcome, {user.displayName}</h3>
// //           <button onClick={handleLogout}>Logout</button>
// //           <br />
// //           <button onClick={generateQRCode}>Generate QR Code</button>
// //           {qrCodeData && <QRCode value={qrCodeData} />}
// //           <br />
// //           {!attendanceMarked ? (
// //             <button onClick={markAttendance}>Mark Attendance</button>
// //           ) : (
// //             <p>✅ Attendance already marked</p>
// //           )}
// //         </>
// //       ) : (
// //         <>
// //           <button onClick={handleLogin}>Login with Google</button>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // const App = () => {
// //   return (
// //     <Router>
// //       <Routes>
// //         <Route path="/" element={<Home />} />
// //         <Route path="/dashboard" element={<TeacherDashboard />} />
// //         <Route path="/scan" element={<QRScanner />} />
// //       </Routes>
// //     </Router>
// //   );
// // };

// // export default App;



// LINK
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import TeacherDashboard from "./components/TeacherDashboard";
// import AttendancePage from "./components/AttendancePage";

// function App() {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<TeacherDashboard />} />
//                 <Route path="/attendance/:attendanceId" element={<AttendancePage />} />
//             </Routes>
//         </Router>
//     );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeacherDashboard from "./components/TeacherDashboard";
import AttendancePage from "./components/AttendancePage";
import Login from "./pages/Login";
import AttendanceHistory from "./components/AttendanceHistory ";

function App() {
    return (
        <div className="bg-gray-900!">
        <Router>
            <Routes>
                <Route path="/" element={<TeacherDashboard />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/login" element={<Login/>}/>
                <Route path="/dashboard" element={<AttendanceHistory/>}/>
            </Routes>
        </Router>
        </div>
    );
}

export default App;
