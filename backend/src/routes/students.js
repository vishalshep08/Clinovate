import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { sendOtpMail } from "../utils/mailer.js";

const router = express.Router();
const prisma = new PrismaClient();

// Send OTP to student email (simulation)
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🧮 Generated OTP:", otp, "for", email);

    let student = await prisma.student.findUnique({ where: { email } });

    if (!student) {
      student = await prisma.student.create({
        data: { name: "Temp", email, password: "", otp },
      });
    } else {
      student = await prisma.student.update({
        where: { email },
        data: { otp },
      });
    }

    console.log("✅ Saved OTP to DB:", student.otp);
    await sendOtpMail(email, otp);

    res.json({ message: "OTP sent to email!" });
  } catch (error) {
    console.error("❌ OTP route error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
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
    data: { name, password: hashedPassword, otp: null },
  });
  console.log("✅ After update:", student);

  // Create a pending request for admin approval
  await prisma.request.create({
    data: { studentId: student.id, status: "pending" },
  });

  res.json({ message: "Registration complete! Await admin approval." });
});
// Student login
router.post("/student-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) return res.status(400).json({ error: "Invalid credentials" });

    const valid = bcrypt.compareSync(password, student.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    // ✅ Generate a JWT token
    const token = jwt.sign(
      { id: student.id, type: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Set cookies (so middleware recognizes login)
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

    // ✅ Return success response (for frontend display)
   return res.status(200).json({
  message: "Student login successful",
  id: student.id, // ✅ ADD THIS
  email: student.email,
  role: "student",
  enrolled: student.enrolled,
});

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});



export default router;



// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";
// import { sendOtpMail } from "../utils/mailer.js";

// const router = express.Router();
// const prisma = new PrismaClient();

// /**
//  * ✉️ Send OTP to student email
//  * - Generates a 6-digit OTP
//  * - Creates/updates student record
//  * - Sends via your mail utility
//  */
// router.post("/send-otp", async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ error: "Email required" });

//   try {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     console.log(`🧮 OTP for ${email}: ${otp}`);

//     // Create or update student with new OTP
//     const student = await prisma.student.upsert({
//       where: { email },
//       update: { otp },
//       create: { name: "Temp", email, password: "", otp },
//     });

//     // Send OTP email
//     await sendOtpMail(email, otp);
//     console.log("✅ OTP saved and sent to:", student.email);

//     res.json({ message: "OTP sent to email successfully!" });
//   } catch (error) {
//     console.error("❌ OTP route error:", error);
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// });

// /**
//  * 🧍‍♀️ Student Registration
//  * - Verifies OTP
//  * - Hashes password
//  * - Creates admin approval request
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

//     // Update student and clear OTP
//     const updatedStudent = await prisma.student.update({
//       where: { email },
//       data: { name, password: hashedPassword, otp: null },
//     });

//     // Create pending approval request
//     await prisma.request.create({
//       data: { studentId: updatedStudent.id, status: "pending" },
//     });

//     res.json({ message: "Registration complete! Await admin approval." });
//   } catch (error) {
//     console.error("❌ Registration error:", error);
//     res.status(500).json({ error: "Failed to register student" });
//   }
// });

// /**
//  * 🎓 Student Login
//  * - Validates email/password
//  * - Issues JWT token + cookies
//  */
// router.post("/student-login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const student = await prisma.student.findUnique({ where: { email } });
//     if (!student) return res.status(400).json({ error: "Invalid credentials" });

//     const valid = bcrypt.compareSync(password, student.password);
//     if (!valid) return res.status(400).json({ error: "Invalid credentials" });

//     // Create JWT token
//     const token = jwt.sign(
//       { id: student.id, type: "student" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Set cookies (secure in prod)
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

