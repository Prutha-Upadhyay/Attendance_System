import { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Firestore instance
import { collection, query, where, getDocs } from "firebase/firestore";
// import { useAuth } from "../context/AuthContext"; // Assuming you use AuthContext
import { CSVLink } from "react-csv";
import axios from "axios";
import logo from "../../public/logo.jpg";

const AttendanceHistory = () => {
  const API_URL =  "https://attendance-system-etnw.onrender.com"; // Change if deployed
  const [attendance, setAttendance] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const fetchStudentsAttendance = async (id = "") => {
    try {
      setLoading(true)
      const response = await axios.post(`${API_URL}/fetch-attendance`, { id });
      const { attendanceRecords } = await response.data;
      console.log("Response : ", response)
      console.log(attendanceRecords);
      setData(attendanceRecords);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log("Error : ", error)
      setId("")
      setData([])
      alert("Failed to fetch attendance records!");
    }

  }

  // Function to convert data to CSV format
  const convertToCSV = () => {
    const headers = ["Student ID", "Student Name", "Marked At"];
    const rows = data.flatMap((attendance) =>
      attendance.marked.map((student) => [
        student.studentId,
        student.studentName,
        new Date(student.markedAt._seconds * 1000).toLocaleString(),
      ])
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((row) => row.join(",")).join("\n");

    return encodeURI(csvContent);
  };

  // Function to trigger CSV download
  const downloadCSV = () => {
    const csvData = convertToCSV();
    const link = document.createElement("a");
    link.setAttribute("href", csvData);
    link.setAttribute("download", "attendance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="p-4 bg-gray-900 min-h-screen flex flex-col items-center justify-center rounded-full border-white">
      {/* Logo */}
      <img
        src={logo}
        alt="Attendify Logo"
          className="w-48 mb-8 filter rounded drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="max-w-4xl w-full">
            <div className="flex gap-4 justify-center mb-8">
            <input
              type="text"
              placeholder="Enter ID"
              className="bg-gray-700 text-gray-200 border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setId(e.target.value)} // Update the ID state
            />
            <button
              
              className={` ${id.length <= 0 ? "cursor-not-allowed! bg-gray-600!" : ""}  bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all`}
              onClick={() => fetchStudentsAttendance(id)} // Use the entered ID
            >
              Fetch Students Attendance
            </button>
            <button
              className={`${data.length <= 0 ? "cursor-not-allowed! bg-gray-600!" : ""} bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all`}
              onClick={downloadCSV}
            >
              Export to CSV
            </button>
          </div>

          {/* Table to display attendance data */}
          <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
            <table className="min-w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-300 font-medium border-b border-gray-600">
                    Student ID
                  </th>
                  <th className="py-3 px-4 text-left text-gray-300 font-medium border-b border-gray-600">
                    Student Name
                  </th>
                  <th className="py-3 px-4 text-left text-gray-300 font-medium border-b border-gray-600">
                    Marked At
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((attendance) =>
                  attendance.marked.map((student, index) => (
                    <tr
                      key={student.studentId}
                      className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                        } hover:bg-gray-700 transition-colors`}
                    >
                      <td className="py-3 px-4 text-gray-200 border-b border-gray-700">
                        {student.studentId}
                      </td>
                      <td className="py-3 px-4 text-gray-200 border-b border-gray-700">
                        {student.studentName}
                      </td>
                      <td className="py-3 px-4 text-gray-400 border-b border-gray-700">
                        {new Date(
                          student.markedAt._seconds * 1000
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;
