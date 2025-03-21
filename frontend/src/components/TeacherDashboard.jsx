// import { useState } from "react";
// import axios from "axios";

// const TeacherDashboard = () => {
//     const [attendanceLink, setAttendanceLink] = useState("");

//     const generateLink = async () => {
//         try {
//             const res = await axios.post("http://localhost:5000/api/generate-attendance-link", {
//                 teacherId: "teacher123",
//                 classId: "classXYZ",
//             });
//             setAttendanceLink(`${window.location.origin}${res.data.link}`);
//         } catch (error) {
//             console.error("Error generating link:", error);
//         }
//     };

//     return (
//         <div>
//             <h2>Teacher Dashboard</h2>
//             <button onClick={generateLink}>Generate Attendance Link</button>
//             {attendanceLink && <p>Share this link: <a href={attendanceLink}>{attendanceLink}</a></p>}
//         </div>
//     );
// };

// export default TeacherDashboard;
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const API_URL = "https://attendance-system-etnw.onrender.com"; // Change if deployed

const TeacherDashboard = () => {
  const [qrData, setQrData] = useState("");

  const generateQRCode = async () => {
    try {
      const res = await fetch(`${API_URL}/generate-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: "teacher123", // Replace with actual teacher ID
          classLat: 23.032097083190017, 
          classLong: 72.46854336833768,
        }),
      });

      const data = await res.json();
      console.log(data)
      if (res.ok) {
        setQrData(data.qrCode);
      } else {
        alert("Error generating QR Code!");
      }
    } catch (error) {
      console.error("QR Code Error:", error);
      alert("Failed to generate QR Code!");
    }
  };

  return (
    <div>
      <button onClick={generateQRCode}>Generate QR Code</button>
      {qrData && <QRCodeCanvas value={qrData} size={200} />}
    </div>
  );
};

export default TeacherDashboard;

