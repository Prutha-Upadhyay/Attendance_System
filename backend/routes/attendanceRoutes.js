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

// Endpoint to fetch attendance records by ID
router.post("/fetch-attendance", async (req, res) => {
    try {
        const { id } = req.body; // Extract the ID from the URL parameter

        // Query the attendanceRecords collection where attendanceId matches the provided ID
        const attendanceRecordsRef = db.collection("attendanceRecords");
        const querySnapshot = await attendanceRecordsRef.where("attendanceId", "==", id).get();

        if (querySnapshot.empty) {
            return res.status(404).json({ error: "No attendance records found for the given ID" });
        }

        // Prepare the response data
        const attendanceRecords = [];
        querySnapshot.forEach((doc) => {
            attendanceRecords.push(doc.data());
        });

        res.json({ success: true, attendanceRecords });
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        res.status(500).json({ error: "Error fetching attendance records" });
    }
});

export default router;
