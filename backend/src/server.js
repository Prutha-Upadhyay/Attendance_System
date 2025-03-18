import express from 'express'
import AWS from "aws-sdk";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());   
app.use(express.json());

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer for File Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Profile Picture to S3
app.post("/upload", upload.single("file"), async (req, res) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `profile_pictures/${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    res.json({ url: data.Location });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "File upload failed" });
  }
});

// AWS SNS Notification
const sns = new AWS.SNS();

app.post("/send-notification", async (req, res) => {
  const { message, phoneNumber } = req.body;

  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
  };

  try {
    await sns.publish(params).promise();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Notification failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// import express from 'express';
// import admin from 'firebase-admin';


// import cors from 'cors';
// import fs from "fs"; 
// import QRCode from 'qrcode';
// import dotenv from 'dotenv';

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());
// // / Get the path from .env
// const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

// try {
//   // Read and parse the JSON file
//   const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });

//   console.log("✅ Firebase Admin initialized successfully.");
// } catch (error) {
//   console.error("❌ Error loading Firebase service account:", error.message);
//   process.exit(1);
// }

// const db = admin.firestore();

// // Generate QR Code
// app.post('/generate-qr', async (req, res) => {
//   const { classId, teacherId } = req.body;
//   const qrData = { classId, teacherId, timestamp: Date.now() };
//   const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
//   res.json({ qrCode });
// });

// // Mark Attendance
// app.post('/mark-attendance', async (req, res) => {
//   const { studentId, qrData } = req.body;
//   const data = JSON.parse(qrData);
//   await db.collection('attendance').add({ studentId, ...data });
//   res.json({ success: true });
// });

// app.listen(5000, () => console.log('Server running on port 5000'));
