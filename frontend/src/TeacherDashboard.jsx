import { useState } from 'react';
import axios from 'axios';
import { QRCode } from "qrcode.react";


const TeacherDashboard = () => {
  const [qrCode, setQrCode] = useState(null);

  const generateQR = async () => {
    const response = await axios.post('/generate-qr', { classId: 'CS101', teacherId: 'teacher123' });
    setQrCode(response.data.qrCode);
  };

  return <div>{qrCode && <QRCode value={qrCode} />} <button onClick={generateQR}>Generate QR</button></div>;
};
export default TeacherDashboard;