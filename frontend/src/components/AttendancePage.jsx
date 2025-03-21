// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { auth, provider } from "../firebaseConfig.js";
// import { signInWithPopup } from "firebase/auth";
// import axios from "axios";

// const AttendancePage = () => {
//     const { attendanceId } = useParams();
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         signInWithPopup(auth, provider)
//             .then((result) => setUser(result.user))
//             .catch((error) => console.error("Login failed:", error));
//     }, []);

//     const markAttendance = async () => {
//         if (!user) return;

//         try {
//             await axios.post("http://localhost:5000/api/mark-attendance", {
//                 attendanceId,
//                 studentEmail: user.email,
//                 studentName: user.displayName,
//             });

//             alert("Attendance marked successfully!");
//             navigate("/");
//         } catch (error) {
//             alert("Error marking attendance. Link may be expired.");
//         }
//     };

//     return (
//         <div>
//             <h2>Mark Attendance</h2>
//             {user ? (
//                 <>
//                     <p>Welcome, {user.displayName}</p>
//                     <button onClick={markAttendance}>Confirm Attendance</button>
//                 </>
//             ) : (
//                 <p>Signing in...</p>
//             )}
//         </div>
//     );
// };

// export default AttendancePage;
// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { auth, db } from "../firebaseConfig";
// import { doc, getDoc, setDoc } from "firebase/firestore";

// const AttendancePage = () => {
//   const [searchParams] = useSearchParams();
//   const attendanceId = searchParams.get("id"); // Read attendance ID from QR Code
//   const [user, setUser] = useState(null);
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setUser(user);
//         requestLocation();
//       } else {
//         window.location.href = "/login"; // Redirect if not logged in
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const requestLocation = () => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setLocation({
//           lat: pos.coords.latitude,
//           long: pos.coords.longitude,
//         });
//       },
//       () => {
//         alert("Location access is required for attendance!");
//       }
//     );
//   };
//   // Log location after state updates
//   useEffect(() => {
//     if (location) {
//       console.log("Updated Location:", location);
//     }
//   }, [location]);

//   requestLocation(); // Call the function
//   const markAttendance = async () => {
//     console.log("hii");
//     console.log(user, location);
//     if (!user || !location) return;

//     const docRef = doc(db, "attendance", attendanceId);
//     const docSnap = await getDoc(docRef);

//     if (!docSnap.exists() || !docSnap.data().active) {
//       alert("Invalid or expired QR Code!");
//       return;
//     }

//     const classLat = 23.03206226016211; // Example: Classroom Latitude
//     const classLong = 72.46849323542574; // Example: Classroom Longitude
//     const distance = getDistance(
//       location.lat,
//       location.long,
//       classLat,
//       classLong
//     );

//     if (distance > 50) {
//       alert("You must be inside the classroom to mark attendance!");
//       return;
//     }

//     await setDoc(
//       docRef,
//       { marked: [...(docSnap.data().marked || []), user.uid] },
//       { merge: true }
//     );

//     alert("Attendance Marked!");
//   };

//   const getDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; // Earth radius in meters
//     const φ1 = (lat1 * Math.PI) / 180;
//     const φ2 = (lat2 * Math.PI) / 180;
//     const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//     const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in meters
//   };

//   return (
//     <div>
//       <h2>Mark Your Attendance</h2>
//       <button onClick={markAttendance}>Mark Present</button>
//     </div>
//   );
// };

// export default AttendancePage;

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import AttendanceHistory from "./AttendanceHistory ";

const API_URL = "https://attendance-system-etnw.onrender.com"; // Change if deployed

const AttendancePage = () => {
  const [searchParams] = useSearchParams();
  const attendanceId = searchParams.get("id"); // Read attendance ID from QR Code
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        requestLocation();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          long: pos.coords.longitude,
        });
      },
      (error) => {
        console.error("Location error:", error);
        alert("Location access is required for attendance!");
      }
    );
  };

  const markAttendance = async () => {
    if (!user || !location) {
      alert("Please wait until your location is fetched!");
      return;
    }
    console.log(user)
    try {
      const res = await fetch(`${API_URL}/mark-attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: user.uid,
          studentName:user.displayName,
          attendanceId,
          lat: location.lat,
          long: location.long,
          lastSignInTime:user.lastSignInTime
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Attendance Marked!");
        navigate("/");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <h2>Mark Your Attendance</h2>
      <button onClick={markAttendance} disabled={!location}>
        {location ? "Mark Present" : "Fetching Location..."}
      </button>
      {/* <button><AttendanceHistory user={user}/></button> */}
    </div>
  );
};

export default AttendancePage;
