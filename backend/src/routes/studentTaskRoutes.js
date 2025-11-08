import express from "express";
import multer from "multer";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// 📁 Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/submissions"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// 📤 Student submits remark for a task
router.post("/submit/:taskId", upload.single("file"), async (req, res) => {
  try {
    const { taskId } = req.params;
    const { studentId } = req.body;

    console.log("📩 Submission upload:", { taskId, studentId, file: req.file });

    if (!studentId) return res.status(400).json({ error: "studentId missing" });
    if (!req.file) return res.status(400).json({ error: "file missing" });

    // Convert types
    const sid = parseInt(studentId);
    const tid = parseInt(taskId);

    // Check if already submitted before
    const existing = await prisma.submission.findFirst({
      where: { studentId: sid, taskId: tid },
    });

    let submission;
    if (existing) {
      submission = await prisma.submission.update({
        where: { id: existing.id },
        data: {
          fileUrl: `/uploads/submissions/${req.file.filename}`,
          status: "Submitted",
          feedback: null,
        },
      });
    } else {
      submission = await prisma.submission.create({
        data: {
          taskId: tid,
          studentId: sid,
          fileUrl: `/uploads/submissions/${req.file.filename}`,
          status: "Submitted",
        },
      });
    }

    res.json(submission);
  } catch (err) {
    console.error("❌ Error uploading submission:", err);
    res.status(500).json({ error: "Failed to upload submission" });
  }
});

// ✅ Fetch student's submissions
router.get("/my-submissions/:studentId", async (req, res) => {
  try {
    const sid = parseInt(req.params.studentId);
    const submissions = await prisma.submission.findMany({
      where: { studentId: sid },
      include: { task: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(submissions);
  } catch (err) {
    console.error("❌ Error fetching submissions:", err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});
export default router;



// import express from "express";
// import multer from "multer";
// import { PrismaClient } from "@prisma/client";
// import { createClient } from "@supabase/supabase-js";
// import { v4 as uuidv4 } from "uuid";

// const prisma = new PrismaClient();
// const router = express.Router();

// // ✅ Supabase client (server-only key)
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// // ✅ Memory storage for direct uploads to Supabase
// const upload = multer({ storage: multer.memoryStorage() });

// /**
//  * 📤 Student submits file for a task
//  * Uploads to Supabase Storage → updates/creates submission record
//  */
// router.post("/submit/:taskId", upload.single("file"), async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const { studentId } = req.body;

//     console.log("📩 Submission upload:", {
//       taskId,
//       studentId,
//       file: req.file?.originalname,
//     });

//     if (!studentId) return res.status(400).json({ error: "studentId missing" });
//     if (!req.file) return res.status(400).json({ error: "file missing" });

//     const sid = parseInt(studentId);
//     const tid = parseInt(taskId);

//     const file = req.file;
//     const uniqueName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
//     const filePath = `submissions/${uniqueName}`;

//     // ⬆️ Upload to Supabase Storage
//     const { data, error: uploadError } = await supabase.storage
//       .from("uploads")
//       .upload(filePath, file.buffer, {
//         contentType: file.mimetype,
//         cacheControl: "3600",
//         upsert: false,
//       });

//     if (uploadError) {
//       console.error("❌ Supabase upload error:", uploadError);
//       return res.status(500).json({ error: "Failed to upload file" });
//     }

//     // Check if student already submitted before
//     const existing = await prisma.submission.findFirst({
//       where: { studentId: sid, taskId: tid },
//     });

//     let submission;
//     if (existing) {
//       submission = await prisma.submission.update({
//         where: { id: existing.id },
//         data: {
//           fileUrl: filePath,
//           status: "Submitted",
//           feedback: null,
//         },
//       });
//     } else {
//       submission = await prisma.submission.create({
//         data: {
//           taskId: tid,
//           studentId: sid,
//           fileUrl: filePath,
//           status: "Submitted",
//         },
//       });
//     }

//     // Generate a temporary signed URL for frontend access
//     const { data: signed, error: signedErr } = await supabase.storage
//       .from("uploads")
//       .createSignedUrl(filePath, 60 * 60); // valid for 1 hour

//     if (signedErr) console.warn("⚠️ Signed URL error:", signedErr);

//     res.status(200).json({
//       message: "Submission uploaded successfully",
//       submission,
//       signedUrl: signed?.signedUrl,
//     });
//   } catch (err) {
//     console.error("❌ Error uploading submission:", err);
//     res.status(500).json({ error: "Failed to upload submission" });
//   }
// });

// /**
//  * ✅ Fetch all submissions for a student
//  */
// router.get("/my-submissions/:studentId", async (req, res) => {
//   try {
//     const sid = parseInt(req.params.studentId);

//     const submissions = await prisma.submission.findMany({
//       where: { studentId: sid },
//       include: { task: true },
//       orderBy: { createdAt: "desc" },
//     });

//     // Optionally attach signed URLs for frontend preview
//     const submissionsWithUrls = await Promise.all(
//       submissions.map(async (sub) => {
//         const { data: signed, error } = await supabase.storage
//           .from("uploads")
//           .createSignedUrl(sub.fileUrl, 60 * 60);

//         return {
//           ...sub,
//           fileUrl: signed?.signedUrl || null,
//         };
//       })
//     );

//     res.json(submissionsWithUrls);
//   } catch (err) {
//     console.error("❌ Error fetching submissions:", err);
//     res.status(500).json({ error: "Failed to fetch submissions" });
//   }
// });

// export default router;
