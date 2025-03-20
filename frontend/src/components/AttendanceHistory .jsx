import { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Firestore instance
import { collection, query, where, getDocs } from "firebase/firestore";
// import { useAuth } from "../context/AuthContext"; // Assuming you use AuthContext
import { CSVLink } from "react-csv";

const AttendanceHistory = () => {
  
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "attendance"),
          where("studentId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAttendance(groupByWeek(data));
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
      setLoading(false);
    };

    fetchAttendance();
  }, [user]);

  // Group attendance by week (Sunday-Saturday)
  const groupByWeek = (records) => {
    const grouped = {};
    records.forEach((record) => {
      const date = new Date(record.date);
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay()); // Get Sunday of that week
      const weekKey = startOfWeek.toISOString().split("T")[0];

      if (!grouped[weekKey]) grouped[weekKey] = [];
      grouped[weekKey].push(record);
    });
    return grouped;
  };

  // Prepare CSV data
  const csvData = [
    ["Date", "Time", "Status"], // Headers
    ...attendance.flatMap((week) =>
      week.map(({ date, time, status }) => [date, time, status])
    ),
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Attendance History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {Object.entries(attendance).map(([week, records]) => (
            <div key={week} className="mb-6">
              <h3 className="font-semibold text-lg">Week Starting: {week}</h3>
              <table className="w-full border-collapse border border-gray-300 mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Time</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border">
                      <td className="border p-2">{record.date}</td>
                      <td className="border p-2">{record.time}</td>
                      <td className="border p-2">{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <CSVLink
            data={csvData}
            filename="attendance_history.csv"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download CSV
          </CSVLink>
        </>
      )}
    </div>
  );
};

export default AttendanceHistory;
