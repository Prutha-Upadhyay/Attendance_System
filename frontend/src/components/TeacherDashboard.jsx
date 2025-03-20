import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const TeacherDashboard = () => {
  const [qrData, setQrData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateQRCode = async () => {
    setIsLoading(true);
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const attendanceData = {
      id: uniqueId,
      createdAt: serverTimestamp(),
      active: true, // Indicates it's a valid QR code
    };

    try {
      await setDoc(doc(db, "attendance", uniqueId), attendanceData);
      setQrData(`http://192.168.80.61:5173/attendance?id=${uniqueId}`);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full text-center border border-gray-700">
        <p className="text-4xl font-roboto text-white mb-4">Attendify</p>
        <p className="text-gray-400 mb-6">
          Generate a QR code for your class attendance.
        </p>

        <button
          onClick={generateQRCode}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
        >
          {isLoading ? "Generating..." : "Generate QR Code"}
        </button>

        {qrData && (
          <div className="mt-8">
            <div className="flex justify-center">
              <QRCodeCanvas
                value={qrData}
                size={200}
                bgColor="#000000"
                fgColor="#ffffff"
              />
            </div>
            <p className="mt-4 text-gray-300 break-words">
              Share this QR code with your students:
            </p>
            <a
              href={qrData}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {qrData}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
