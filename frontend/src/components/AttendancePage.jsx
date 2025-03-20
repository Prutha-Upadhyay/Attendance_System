import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AttendancePage = () => {
  const [searchParams] = useSearchParams();
  const attendanceId = searchParams.get("id"); // Read attendance ID from QR Code
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate(); // Use React Router navigation

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        requestLocation(); // Request location only once after login
      } else {
        navigate("/login"); // Better than window.location.href
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

  useEffect(() => {
    if (location) {
      console.log("Updated Location:", location);
    }
  }, [location]);

  const markAttendance = async () => {
    if (!user || !location) {
      alert("Please wait until your location is fetched!");
      return;
    }

    console.log("User:", user);
    console.log("Location:", location);

    const docRef = doc(db, "attendance", attendanceId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || !docSnap.data().active) {
      alert("Invalid or expired QR Code!");
      return;
    }

    const classLat = 23.03206226016211; // Example: Classroom Latitude
    const classLong = 72.46849323542574; // Example: Classroom Longitude
    const distance = getDistance(
      location.lat,
      location.long,
      classLat,
      classLong
    );

    if (distance > 1000) {
      alert("You must be inside the classroom to mark attendance!");
      return;
    }

    await setDoc(
      docRef,
      { marked: [...(docSnap.data().marked || []), user.uid] },
      { merge: true }
    );

    alert("Attendance Marked!");
    navigate("/");
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: `url(/path/to/your/background-image.jpg)`, // Add your background image path
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-gray-800/90 rounded-lg shadow-2xl p-8 max-w-md w-full text-center border border-gray-700 backdrop-blur-sm">
        <div className="animate-fadeIn">
          <h2 className="text-2xl font-bold text-white mb-6">
            Mark Your Attendance
          </h2>
        </div>
        <button
          onClick={markAttendance}
          disabled={!location}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          {location ? "Mark Present" : "Fetching Location..."}
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
