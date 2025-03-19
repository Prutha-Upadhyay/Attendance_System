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
import { db } from "../firebaseConfig"; 
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const TeacherDashboard = () => {
  const [qrData, setQrData] = useState("");

  const generateQRCode = async () => {
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const attendanceData = {
      id: uniqueId,
      createdAt: serverTimestamp(),
      active: true, // Indicates it's a valid QR code
    };

    await setDoc(doc(db, "attendance", uniqueId), attendanceData);

    setQrData(`${window.location.origin}/attendance?id=${uniqueId}`);
  };

  return (
    <div>
      <button onClick={generateQRCode}>Generate QR Code</button>
      {qrData && <QRCodeCanvas value={qrData} size={200} />
    }
    </div>
  );
};

export default TeacherDashboard;
