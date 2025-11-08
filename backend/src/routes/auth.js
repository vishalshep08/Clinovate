import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Send OTP (simulate)
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP to student if exists or create temp
  let student = await prisma.student.findUnique({ where: { email } });
  if (!student) {
    student = await prisma.student.create({
      data: { email, name: "Temp", password: "", otp },
    });
  } else {
    student = await prisma.student.update({
      where: { email },
      data: { otp },
    });
  }

  console.log(`OTP for ${email}: ${otp}`); // For testing
  res.json({ message: "OTP sent (check console for demo)", otp });
});

// Student registration
router.post("/register", async (req, res) => {
  const { name, email, password, otp } = req.body;
  if (!name || !email || !password || !otp)
    return res.status(400).json({ error: "All fields required" });

  const student = await prisma.student.findUnique({ where: { email } });
  if (!student || student.otp !== otp)
    return res.status(400).json({ error: "Invalid OTP" });

  const hashedPassword = bcrypt.hashSync(password, 10);

  await prisma.student.update({
    where: { email },
    data: { name, password: hashedPassword, enrolled: false, otp: null },
  });

  res.json({ message: "Registration complete! Await admin approval." });
});

router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const valid = bcrypt.compareSync(password, admin.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, type: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.cookie("role", "admin", {
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Admin login successful",
      email,
      role: "admin",
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =========================
// Student Login (fixed)
// =========================
router.post("/student-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) return res.status(400).json({ error: "Invalid credentials" });

    const valid = bcrypt.compareSync(password, student.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: student.id, type: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.cookie("role", "student", {
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Student login successful",
      id: student.id, 
      email: student.email,
      role: "student",
      enrolled: student.enrolled,
    });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;


// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const router = express.Router();
// const prisma = new PrismaClient();

// /**
//  * ✉️ Send OTP (simulated for demo)
//  * In production, integrate with real email provider (Resend, Nodemailer, etc.)
//  */
// router.post("/send-otp", async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ error: "Email required" });

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   try {
//     // Check if student exists
//     let student = await prisma.student.findUnique({ where: { email } });

//     if (!student) {
//       student = await prisma.student.create({
//         data: { email, name: "Temp", password: "", otp },
//       });
//     } else {
//       student = await prisma.student.update({
//         where: { email },
//         data: { otp },
//       });
//     }

//     console.log(`✅ OTP for ${email}: ${otp}`); // For testing
//     res.json({ message: "OTP sent (check console for demo)" });
//   } catch (err) {
//     console.error("❌ Send OTP error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// /**
//  * 🧍‍♀️ Student Registration
//  */
// router.post("/register", async (req, res) => {
//   const { name, email, password, otp } = req.body;
//   if (!name || !email || !password || !otp)
//     return res.status(400).json({ error: "All fields required" });

//   try {
//     const student = await prisma.student.findUnique({ where: { email } });
//     if (!student || student.otp !== otp)
//       return res.status(400).json({ error: "Invalid OTP" });

//     const hashedPassword = bcrypt.hashSync(password, 10);

//     await prisma.student.update({
//       where: { email },
//       data: { name, password: hashedPassword, enrolled: false, otp: null },
//     });

//     res.json({ message: "Registration complete! Await admin approval." });
//   } catch (err) {
//     console.error("❌ Register error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// /**
//  * 👨‍💼 Admin Login
//  */
// router.post("/admin-login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const admin = await prisma.admin.findUnique({ where: { email } });
//     if (!admin) return res.status(400).json({ error: "Invalid credentials" });

//     const valid = bcrypt.compareSync(password, admin.password);
//     if (!valid) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: admin.id, type: "admin" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Set secure cookies
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//     });

//     res.cookie("role", "admin", {
//       sameSite: "lax",
//       path: "/",
//     });

//     res.status(200).json({
//       message: "Admin login successful",
//       email,
//       role: "admin",
//     });
//   } catch (err) {
//     console.error("❌ Admin login error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// /**
//  * 🎓 Student Login
//  */
// router.post("/student-login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const student = await prisma.student.findUnique({ where: { email } });
//     if (!student) return res.status(400).json({ error: "Invalid credentials" });

//     const valid = bcrypt.compareSync(password, student.password);
//     if (!valid) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: student.id, type: "student" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Set cookies
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//     });

//     res.cookie("role", "student", {
//       sameSite: "lax",
//       path: "/",
//     });

//     res.status(200).json({
//       message: "Student login successful",
//       id: student.id,
//       email: student.email,
//       role: "student",
//       enrolled: student.enrolled,
//     });
//   } catch (error) {
//     console.error("❌ Student login error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;

