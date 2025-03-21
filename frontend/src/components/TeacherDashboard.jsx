import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const API_URL = "https://attendance-system-etnw.onrender.com"; // Change if deployed

const TeacherDashboard = () => {
  const [qrData, setQrData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  

  const generateQRCode = async () => {
    try {
      const res = await fetch(`${API_URL}/generate-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: "teacher123", // Replace with actual teacher ID
          classLat: 23.048674956169467,
          classLong: 72.52511868134404,
        }),
      });

      const data = await res.json();
      console.log(data);
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
              target="_self"
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
