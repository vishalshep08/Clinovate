
import express from "express";
import multer from "multer";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/sops"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 👉 Get all SOPs
router.get("/", async (req, res) => {
  try {
    const sops = await prisma.sOP.findMany({ orderBy: { id: "desc" } });
    res.json(sops);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch SOPs" });
  }
});

// 👉 Upload new SOP
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const sop = await prisma.sOP.create({
      data: { title, fileUrl: `/uploads/sops/${req.file.filename}` },
    });
    res.json(sop);
  } catch (err) {
    res.status(500).json({ error: "Failed to upload SOP" });
  }
});

// 👉 Update SOP title
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const updated = await prisma.sOP.update({
      where: { id: parseInt(id) },
      data: { title },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update SOP" });
  }
});

// 👉 Delete SOP
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.sOP.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete SOP" });
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

// // ✅ Supabase client (use Service Role key server-side only)
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// // ✅ Use memory storage for direct upload to Supabase
// const upload = multer({ storage: multer.memoryStorage() });

// /**
//  * 📦 GET all SOPs
//  */
// router.get("/", async (req, res) => {
//   try {
//     const sops = await prisma.sOP.findMany({ orderBy: { id: "desc" } });
//     res.json(sops);
//   } catch (err) {
//     console.error("❌ Fetch SOPs error:", err);
//     res.status(500).json({ error: "Failed to fetch SOPs" });
//   }
// });

// /**
//  * 📤 Upload new SOP (direct to Supabase Storage)
//  */
// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const { title } = req.body;
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const file = req.file;
//     const uniqueName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
//     const filePath = `sops/${uniqueName}`;

//     // ⬆️ Upload to Supabase bucket ("uploads")
//     const { data, error: uploadError } = await supabase.storage
//       .from("uploads")
//       .upload(filePath, file.buffer, {
//         contentType: file.mimetype,
//         cacheControl: "3600",
//         upsert: false,
//       });

//     if (uploadError) {
//       console.error("Supabase upload error:", uploadError);
//       return res.status(500).json({ error: "Failed to upload file" });
//     }

//     // 🔗 Optional: Generate a signed URL valid for 1 hour
//     const { data: signed, error: signedErr } = await supabase.storage
//       .from("uploads")
//       .createSignedUrl(filePath, 60 * 60);

//     if (signedErr) console.warn("Signed URL error:", signedErr);

//     // 💾 Save record in Prisma (store path or URL)
//     const sop = await prisma.sOP.create({
//       data: {
//         title,
//         fileUrl: filePath, // store Supabase path
//       },
//     });

//     res.status(201).json({
//       message: "SOP uploaded successfully",
//       sop,
//       signedUrl: signed?.signedUrl,
//     });
//   } catch (err) {
//     console.error("❌ Upload SOP error:", err);
//     res.status(500).json({ error: "Failed to upload SOP" });
//   }
// });

// /**
//  * ✏️ Update SOP title
//  */
// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title } = req.body;

//     const updated = await prisma.sOP.update({
//       where: { id: parseInt(id) },
//       data: { title },
//     });

//     res.json(updated);
//   } catch (err) {
//     console.error("❌ Update SOP error:", err);
//     res.status(500).json({ error: "Failed to update SOP" });
//   }
// });

// /**
//  * ❌ Delete SOP (and remove file from Supabase Storage)
//  */
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the SOP first to get file path
//     const sop = await prisma.sOP.findUnique({ where: { id: parseInt(id) } });
//     if (!sop) return res.status(404).json({ error: "SOP not found" });

//     // Delete from Supabase Storage
//     const { error: delError } = await supabase.storage
//       .from("uploads")
//       .remove([sop.fileUrl]);

//     if (delError) console.warn("Storage delete warning:", delError);

//     // Delete DB record
//     await prisma.sOP.delete({ where: { id: parseInt(id) } });

//     res.json({ message: "SOP deleted successfully" });
//   } catch (err) {
//     console.error("❌ Delete SOP error:", err);
//     res.status(500).json({ error: "Failed to delete SOP" });
//   }
// });

// export default router;
