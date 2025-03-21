// import express from 'express'
// import AWS from "aws-sdk";
// import multer from "multer";
// import dotenv from "dotenv";
// import cors from "cors";

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;
// app.use(cors());   
// app.use(express.json());

// // AWS S3 Configuration
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// // Multer for File Uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Upload Profile Picture to S3
// app.post("/upload", upload.single("file"), async (req, res) => {
//   const params = {
//     Bucket: process.env.AWS_S3_BUCKET,
//     Key: `profile_pictures/${req.file.originalname}`,
//     Body: req.file.buffer,
//     ContentType: req.file.mimetype,
//   };

//   try {
//     const data = await s3.upload(params).promise();
//     res.json({ url: data.Location });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "File upload failed" });
//   }
// });

// // AWS SNS Notification
// const sns = new AWS.SNS();

// app.post("/send-notification", async (req, res) => {
//   const { message, phoneNumber } = req.body;

//   const params = {
//     Message: message,
//     PhoneNumber: phoneNumber,
//   };

//   try {
//     await sns.publish(params).promise();
//     res.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Notification failed" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // import express from 'express';
// // import admin from 'firebase-admin';


// // import cors from 'cors';
// // import fs from "fs"; 
// // import QRCode from 'qrcode';
// // import dotenv from 'dotenv';

// // dotenv.config();
// // const app = express();
// // app.use(cors());
// // app.use(express.json());
// // // / Get the path from .env
// // const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

// // try {
// //   // Read and parse the JSON file
// //   const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// //   admin.initializeApp({
// //     credential: admin.credential.cert(serviceAccount),
// //   });

// //   console.log("✅ Firebase Admin initialized successfully.");
// // } catch (error) {
// //   console.error("❌ Error loading Firebase service account:", error.message);
// //   process.exit(1);
// // }

// // const db = admin.firestore();

// // // Generate QR Code
// // app.post('/generate-qr', async (req, res) => {
// //   const { classId, teacherId } = req.body;
// //   const qrData = { classId, teacherId, timestamp: Date.now() };
// //   const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
// //   res.json({ qrCode });
// // });

// // // Mark Attendance
// // app.post('/mark-attendance', async (req, res) => {
// //   const { studentId, qrData } = req.body;
// //   const data = JSON.parse(qrData);
// //   await db.collection('attendance').add({ studentId, ...data });
// //   res.json({ success: true });
// // });

// // app.listen(5000, () => console.log('Server running on port 5000'));

// LINK
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import attendanceRoutes from './routes/attendanceRoutes.js'

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api", attendanceRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// import express from "express";
// import cors from "cors";
// import { db, admin } from "./firebaseConfig.js";

// const app = express();

// app.use(cors({ 
//   origin: "http://localhost:5173", 
//   methods: "GET,POST,PUT,DELETE",
//   allowedHeaders: "Content-Type,Authorization"
// }));

// app.use(express.json());
// app.use(cors({ origin: process.env.FRONTEND_URL })); // Allow only frontend to access APIs

// // 🎯 Generate Attendance QR Code
// app.post("/generate-attendance", async (req, res) => {
//   try {
//     const { teacherId, classLat, classLong } = req.body;

//     const uniqueId = Math.random().toString(36).substr(2, 9);
//     const createdAt = admin.firestore.Timestamp.now();

//     const attendanceData = {
//       id: uniqueId,
//       teacherId,
//       classLat,
//       classLong,
//       createdAt,
//       active: true,
//       marked: [],
//     };

//     await db.collection("attendance").doc(uniqueId).set(attendanceData);

//     res.status(200).json({ qrCode: `${"http://localhost:5173"}/attendance?id=${uniqueId}` });
//   } catch (error) {
//     res.status(500).json({ error: "Error generating QR Code" });
//   }
// });

// // 🎯 Student Marks Attendance
// app.post("/mark-attendance", async (req, res) => {
//   try {
//     const { studentId, attendanceId, lat, long } = req.body;

//     const docRef = db.collection("attendance").doc(attendanceId);
//     const docSnap = await docRef.get();

//     if (!docSnap.exists) {
//       return res.status(400).json({ error: "Invalid QR Code!" });
//     }

//     const attendance = docSnap.data();
//     const { createdAt, classLat, classLong, marked } = attendance;

//     // 🎯 Check if QR Code Expired (valid for 10 minutes)
//     const expirationTime = createdAt.toDate().getTime() + 10 * 60 * 1000;
//     if (Date.now() > expirationTime) {
//       return res.status(400).json({ error: "QR Code Expired!" });
//     }

//     // 🎯 Check if Student is in Classroom
//     const distance = getDistance(lat, long, classLat, classLong);
//     if (distance > 50) {
//       return res.status(400).json({ error: "You must be inside the classroom!" });
//     }

//     // 🎯 Prevent Duplicate Attendance
//     if (marked.includes(studentId)) {
//       return res.status(400).json({ error: "Attendance Already Marked!" });
//     }

//     // 🎯 Mark Attendance
//     await docRef.update({ marked: admin.firestore.FieldValue.arrayUnion(studentId) });

//     res.status(200).json({ message: "Attendance Marked Successfully!" });
//   } catch (error) {
//     console.error("Error marking attendance:", error);
//     res.status(500).json({ error: "Error marking attendance" });
//   }
// });

// // 🎯 Function to Calculate Distance (Haversine Formula)
// function getDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371e3; // Earth's radius in meters
//   const φ1 = (lat1 * Math.PI) / 180;
//   const φ2 = (lat2 * Math.PI) / 180;
//   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//   const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//   const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//             Math.cos(φ1) * Math.cos(φ2) *
//             Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c; // Distance in meters
// }

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import express from "express";
import cors from "cors";
import { db, admin } from "./firebaseConfig.js";

const app = express();

app.use(cors({ 
  origin: "https://attendance-system-8d55e.web.app", 
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());

// 🎯 Generate Attendance QR Code
app.post("/generate-attendance", async (req, res) => {
  try {
    const { teacherId, classLat, classLong } = req.body;

    const uniqueId = Math.random().toString(36).substr(2, 9);
    const createdAt = admin.firestore.Timestamp.now();

    const attendanceData = {
      id: uniqueId,
      teacherId,
      classLat,
      classLong,
      createdAt,
      active: true,
      marked: []  // Initially empty, will store students when they mark attendance
    };

    await db.collection("attendance").doc(uniqueId).set(attendanceData);

    res.status(200).json({ 
      qrCode: `https://attendance-system-8d55e.web.app/attendance?id=${uniqueId}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating QR Code" });
  }
});

// Helper function to calculate distance between two coordinates (Haversine Formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// 🎯 Student Marks Attendance with Location Check
app.post("/mark-attendance", async (req, res) => {
try {
  const { attendanceId, studentId, studentName, studentLat, studentLong } = req.body;
  const markedAt = admin.firestore.Timestamp.now();

  const attendanceRef = db.collection("attendance").doc(attendanceId);
  const attendanceDoc = await attendanceRef.get();

  if (!attendanceDoc.exists) {
    return res.status(404).json({ error: "Attendance record not found" });
  }

  const attendanceData = attendanceDoc.data();
  if (!attendanceData.active) {
    return res.status(400).json({ error: "Attendance session is closed" });
  }

  // 🔥 Check if student is inside the classroom (within 10 meters)
  const distance = getDistance(attendanceData.classLat, attendanceData.classLong, studentLat, studentLong);
  if (distance > 1000) {  // 10 meters threshold
    return res.status(403).json({ error: "You are not inside the classroom" });
  }

  const newStudent = { studentId, studentName, markedAt };

  await attendanceRef.update({
    marked: admin.firestore.FieldValue.arrayUnion(newStudent)
  });

  res.status(200).json({ message: "Attendance marked successfully!" });

} catch (error) {
  console.error(error);
  res.status(500).json({ error: "Error marking attendance" });
}
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
