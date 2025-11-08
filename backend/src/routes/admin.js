import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

const router = express.Router();
const prisma = new PrismaClient();

// Make sure this is in your main server file (not inside the router)
router.use(cookieParser());

// Admin login
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const valid = bcrypt.compareSync(password, admin.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, type: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // token expires in 7 days
    );

    // Set role explicitly
    const role = "admin";

    // ✅ Set secure cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS in prod
      sameSite: "lax",
      path: "/",
    });

    res.cookie("role", role, {
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Admin login successful",
      email,
      role,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




// Get pending requests for dashboard
router.get("/requests", async (req, res) => {
  const requests = await prisma.request.findMany({
    where: { status: "pending" },
    include: { student: true },
  });
  res.json({ requests });
});

// Approve / Reject student request
router.post("/requests/:id", async (req, res) => {
  const { status } = req.body; // approved/rejected
  const { id } = req.params;

  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  const updated = await prisma.request.update({
    where: { id: parseInt(id) },
    data: { status },
  });

  if (status === "approved") {
    await prisma.student.update({
      where: { id: updated.studentId },
      data: { enrolled: true },
    });
  }

  res.json({ message: `Request ${status} successfully!` });
});
// Get all enrolled students
router.get("/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      where: { enrolled: true }, // only approved/enrolled students
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;




// import express from "express";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import cookieParser from "cookie-parser";

// const router = express.Router();
// const prisma = new PrismaClient();

// // 🔐 Middleware
// router.use(cookieParser());

// /**
//  * 🧠 ADMIN LOGIN
//  * - Verifies email/password
//  * - Generates JWT stored in httpOnly cookie
//  * - Returns role and email
//  */
// router.post("/admin-login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     if (!email || !password)
//       return res.status(400).json({ error: "Email and password required" });

//     const admin = await prisma.admin.findUnique({ where: { email } });
//     if (!admin) return res.status(400).json({ error: "Invalid credentials" });

//     const valid = bcrypt.compareSync(password, admin.password);
//     if (!valid) return res.status(400).json({ error: "Invalid credentials" });

//     // ✅ Generate JWT
//     const token = jwt.sign(
//       { id: admin.id, type: "admin" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     const role = "admin";

//     // ✅ Set secure cookies
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//     });

//     res.cookie("role", role, {
//       sameSite: "lax",
//       path: "/",
//     });

//     return res.status(200).json({
//       message: "Admin login successful",
//       email,
//       role,
//     });
//   } catch (err) {
//     console.error("❌ Admin login error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// /**
//  * 📋 GET PENDING REQUESTS
//  * Used in Admin Dashboard — shows student enrollment requests
//  */
// router.get("/requests", async (req, res) => {
//   try {
//     const requests = await prisma.request.findMany({
//       where: { status: "pending" },
//       include: { student: true },
//       orderBy: { createdAt: "desc" },
//     });

//     res.json({ requests });
//   } catch (err) {
//     console.error("❌ Fetch requests error:", err);
//     res.status(500).json({ error: "Failed to fetch requests" });
//   }
// });

// /**
//  * ✅ APPROVE or REJECT REQUEST
//  * Updates student enrollment based on admin action
//  */
// router.post("/requests/:id", async (req, res) => {
//   const { status } = req.body;
//   const { id } = req.params;

//   try {
//     if (!["approved", "rejected"].includes(status))
//       return res.status(400).json({ error: "Invalid status" });

//     const updated = await prisma.request.update({
//       where: { id: parseInt(id) },
//       data: { status },
//     });

//     if (status === "approved") {
//       await prisma.student.update({
//         where: { id: updated.studentId },
//         data: { enrolled: true },
//       });
//     }

//     res.json({ message: `Request ${status} successfully!` });
//   } catch (err) {
//     console.error("❌ Approve/reject error:", err);
//     res.status(500).json({ error: "Failed to update request" });
//   }
// });

// /**
//  * 🎓 GET ENROLLED STUDENTS
//  * Lists all approved/enrolled students
//  */
// router.get("/students", async (req, res) => {
//   try {
//     const students = await prisma.student.findMany({
//       where: { enrolled: true },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         createdAt: true,
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     res.json(students);
//   } catch (err) {
//     console.error("❌ Get students error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;
