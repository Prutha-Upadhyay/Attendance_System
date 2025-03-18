import { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import axios from 'axios';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data);
      await axios.post('/mark-attendance', { studentId: 'user123', qrData: data.text });
    }
  };

  return <QrScanner delay={300} onScan={handleScan} onError={(err) => console.error(err)} />;
};
export default QRScanner;
