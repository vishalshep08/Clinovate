
import express from "express";
import multer from "multer";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// 📁 Multer setup for admin-uploaded tasks
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/tasks"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// 🧩 Admin uploads a new task
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        fileUrl: `/uploads/tasks/${req.file.filename}`,
      },
    });

    res.json({ message: "Task uploaded successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload task" });
  }
});

// 📥 Get all tasks
router.get("/", async (req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
  res.json(tasks);
});

// ✅ Get all submissions for a specific task
router.get("/submissions/:taskId", async (req, res) => {
  const { taskId } = req.params;
  try {
    const submissions = await prisma.submission.findMany({
      where: { taskId: parseInt(taskId) },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = submissions.map((sub) => ({
      id: sub.id,
      taskId: sub.taskId,
      remarkUrl: sub.fileUrl,
      status: sub.status,
      feedback: sub.feedback,
      studentName: sub.student?.name || "Unknown",
      studentEmail: sub.student?.email || "N/A",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching submissions:", err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// ✅ Update submission status (Accept / Reject)
router.post("/update-status/:submissionId", async (req, res) => {
  const { submissionId } = req.params;
  const { status, feedback } = req.body;

  try {
    const updated = await prisma.submission.update({
      where: { id: parseInt(submissionId) },
      data: {
        status,
        feedback: feedback || null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating submission status:", err);
    res.status(500).json({ error: "Failed to update submission status" });
  }
});


// 🧾 Admin updates submission status (Accept/Reject)
router.post("/review/:submissionId", async (req, res) => {
  const { submissionId } = req.params;
  const { status, feedback } = req.body;

  try {
    const updated = await prisma.submission.update({
      where: { id: parseInt(submissionId) },
      data: { status, feedback },
    });

    res.json({ message: "Submission reviewed", updated });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ error: "Failed to update submission status" });
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

// // ✅ Supabase client
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// // ✅ Use memory storage (no local file writes)
// const upload = multer({ storage: multer.memoryStorage() });

// /**
//  * 🧩 Admin uploads a new task (to Supabase Storage)
//  */
// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const { title } = req.body;
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const file = req.file;
//     const uniqueName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
//     const filePath = `tasks/${uniqueName}`;

//     // ⬆️ Upload file to Supabase Storage
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

//     // 💾 Save metadata to DB
//     const task = await prisma.task.create({
//       data: {
//         title,
//         fileUrl: filePath, // store path
//       },
//     });

//     // 🔗 Optional: signed URL for frontend
//     const { data: signed, error: signedErr } = await supabase.storage
//       .from("uploads")
//       .createSignedUrl(filePath, 60 * 60); // valid 1 hour

//     if (signedErr) console.warn("Signed URL warning:", signedErr);

//     res.status(201).json({
//       message: "Task uploaded successfully",
//       task,
//       signedUrl: signed?.signedUrl,
//     });
//   } catch (err) {
//     console.error("❌ Upload Task error:", err);
//     res.status(500).json({ error: "Failed to upload task" });
//   }
// });

// /**
//  * 📥 Get all tasks
//  */
// router.get("/", async (req, res) => {
//   try {
//     const tasks = await prisma.task.findMany({
//       orderBy: { createdAt: "desc" },
//     });
//     res.json(tasks);
//   } catch (err) {
//     console.error("❌ Fetch Tasks error:", err);
//     res.status(500).json({ error: "Failed to fetch tasks" });
//   }
// });

// /**
//  * 🧾 Get all submissions for a specific task
//  */
// router.get("/submissions/:taskId", async (req, res) => {
//   const { taskId } = req.params;
//   try {
//     const submissions = await prisma.submission.findMany({
//       where: { taskId: parseInt(taskId) },
//       include: {
//         student: {
//           select: { id: true, name: true, email: true },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     const formatted = submissions.map((sub) => ({
//       id: sub.id,
//       taskId: sub.taskId,
//       remarkUrl: sub.fileUrl,
//       status: sub.status,
//       feedback: sub.feedback,
//       studentName: sub.student?.name || "Unknown",
//       studentEmail: sub.student?.email || "N/A",
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error("❌ Error fetching submissions:", err);
//     res.status(500).json({ error: "Failed to fetch submissions" });
//   }
// });

// /**
//  * ✅ Update submission status (Accept / Reject)
//  */
// router.post("/update-status/:submissionId", async (req, res) => {
//   const { submissionId } = req.params;
//   const { status, feedback } = req.body;

//   try {
//     const updated = await prisma.submission.update({
//       where: { id: parseInt(submissionId) },
//       data: {
//         status,
//         feedback: feedback || null,
//       },
//     });

//     res.json(updated);
//   } catch (err) {
//     console.error("❌ Error updating submission status:", err);
//     res.status(500).json({ error: "Failed to update submission status" });
//   }
// });

// /**
//  * 🧾 Admin reviews submission (Accept/Reject)
//  */
// router.post("/review/:submissionId", async (req, res) => {
//   const { submissionId } = req.params;
//   const { status, feedback } = req.body;

//   try {
//     const updated = await prisma.submission.update({
//       where: { id: parseInt(submissionId) },
//       data: { status, feedback },
//     });

//     res.json({ message: "Submission reviewed", updated });
//   } catch (err) {
//     console.error("❌ Review submission error:", err);
//     res.status(500).json({ error: "Failed to review submission" });
//   }
// });

// export default router;
