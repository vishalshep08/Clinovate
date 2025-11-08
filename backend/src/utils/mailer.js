// import nodemailer from "nodemailer";

// export const sendOtpMail = async (email, otp) => {
//   try {
//     console.log("💡 EMAIL_USER:", process.env.EMAIL_USER);
// console.log("💡 EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");

//     const transporter = nodemailer.createTransport({
//       host: "smtp-relay.brevo.com",
//       port: 465,            // or 465 for SSL
//       secure: true,        // true for port 465
//       auth: {
//         user: process.env.BREVO_USER, // your Brevo SMTP login (email)
//         pass: process.env.BREVO_PASS, // your Brevo SMTP key
//       },
//     });

//     const mailOptions = {
//       from: `"Clinovate Team" <${process.env.BREVO_USER}>`,
//       to: email,
//       subject: "Clinovate Email Verification OTP",
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//           <h2>Welcome to Clinovate!</h2>
//           <p>Use the OTP below to verify your email address:</p>
//           <h1 style="color: #4CAF50; letter-spacing: 4px;">${otp}</h1>
//           <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
//           <p>Best regards,<br><strong>Clinovate Team</strong></p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`✅ OTP sent to ${email}`);
//   } catch (error) {
//     console.error("❌ Failed to send OTP email:", error);
//     throw new Error("Email send failed");
//   }
// };




import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendOtpMail = async (to, otp) => {
  try {
    console.log("💡 EMAIL_USER:", process.env.EMAIL_USER);
    console.log("💡 EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");

    const isMailtrap = process.env.EMAIL_USER.includes("mailtrap");

    const transporter = nodemailer.createTransport(
      isMailtrap
        ? {
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          }
        : {
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          }
    );

    await transporter.sendMail({
      from: `"Clinovate" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code - Clinovate",
      text: `Your OTP code is: ${otp}`,
    });

    console.log("✅ OTP email sent successfully!");
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new Error("Email send failed");
  }
};
