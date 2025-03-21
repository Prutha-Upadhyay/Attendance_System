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
    console.log(user);
    try {
      const res = await fetch(`${API_URL}/mark-attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: user.uid,
          studentName: user.displayName,
          attendanceId,
          lat: location.lat,
          long: location.long,
          lastSignInTime: user.lastSignInTime,
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
