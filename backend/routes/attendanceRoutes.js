import express from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebaseConfig.js";

const router = express.Router();

// Generate a temporary attendance link (valid for 5 mins)
router.post("/generate-attendance-link", async (req, res) => {
    try {
        const { teacherId, classId } = req.body;
        const attendanceId = uuidv4();
        const expiresAt = Date.now() + 5 * 60 * 1000; // Expiry: 5 min

        await db.collection("attendanceLinks").doc(attendanceId).set({
            teacherId,
            classId,
            expiresAt,
        });

        res.json({ link: `/attendance/${attendanceId}` });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate link" });
    }
});

// Mark Attendance
router.post("/mark-attendance", async (req, res) => {
    try {
        const { attendanceId, studentEmail, studentName } = req.body;
        const attendanceRef = db.collection("attendanceLinks").doc(attendanceId);
        const attendanceDoc = await attendanceRef.get();

        if (!attendanceDoc.exists || Date.now() > attendanceDoc.data().expiresAt) {
            return res.status(400).json({ error: "Attendance link expired or invalid" });
        }

        await db.collection("attendanceRecords").add({
            attendanceId,
            studentEmail,
            studentName,
            timestamp: Date.now(),
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Error marking attendance" });
    }
});

export default router;
