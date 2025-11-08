// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Register({ onRegister }) {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const router = useRouter();

//   const sendOtp = async () => {
//     if (!email) return alert("Enter email first");

//     try {
//       const res = await fetch("http://localhost:5000/api/students/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const data = await res.json();
//       console.log("OTP from backend:", data.otp);
//       setOtpSent(true);
//       alert("OTP sent! Check your email.");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send OTP");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) return alert("Passwords do not match");
//     if (!otpSent || !otp) return alert("Enter OTP");

//     try {
//       const res = await fetch("http://localhost:5000/api/students/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: fullName, email, password, otp }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // ✅ Show success modal
//         setShowSuccessModal(true);
//         if (onRegister) onRegister({ name: fullName, email });

//         // ⏳ Auto close + redirect after 2.5 seconds
//         setTimeout(() => {
//           setShowSuccessModal(false);
//           router.push("/login");
//         }, 2500);
//       } else {
//         alert(data.error || "Registration failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#A0F0E0] to-[#009688]">
//       <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-300">
//         <h2 className="text-2xl font-bold text-center text-[#004D40] mb-6">
//           Student Registration
//         </h2>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <input
//             type="text"
//             placeholder="Full Name"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             className="border border-[#004D40] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-white"
//             required
//           />

//           <div className="flex gap-2">
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="flex-1 border border-[#004D40] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-white"
//               required
//             />
//             <button
//               type="button"
//               onClick={sendOtp}
//               className="bg-[#004D40] text-white px-4 rounded-lg font-semibold hover:bg-[#26A69A] transition"
//             >
//               {otpSent ? "Resend OTP" : "Send OTP"}
//             </button>
//           </div>

//           {otpSent && (
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="border border-[#004D40] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-white"
//               required
//             />
//           )}

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border border-[#004D40] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-white"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             className="border border-[#004D40] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-white"
//             required
//           />

//           <button
//             type="submit"
//             className="bg-[#004D40] text-white py-3 rounded-lg font-semibold hover:bg-[#26A69A] transition"
//           >
//             Register
//           </button>
//         </form>
//       </div>

//       {/* ✅ Success Modal */}
//       {showSuccessModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center animate-fadeIn">
//             <h3 className="text-xl font-semibold text-[#004D40] mb-2">
//               Registration Successful 🎉
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Redirecting to login page...
//             </p>
//             <div className="animate-spin border-4 border-[#004D40] border-t-transparent rounded-full w-8 h-8 mx-auto"></div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, KeyRound, Send } from "lucide-react";
import Modal from "@/components/Modal";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ show: false, type: "info", title: "", message: "" });

  const router = useRouter();

  // Countdown for resend OTP
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Send OTP
  const sendOtp = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }

    try {
      // const res = await fetch("http://localhost:5000/api/students/send-otp", {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
 


      const data = await res.json();

      if (res.ok) {
        console.log("OTP from backend:", data.otp);
        setOtpSent(true);
        setOtpTimer(60);
        setError("");
        setModal({
  show: true,
  type: "success",
  title: "OTP Sent!",
  message: "Check your email inbox for the verification code.",
});

      } else {
        setError(data.error || "Failed to send OTP. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword || !otp) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // const res = await fetch("http://localhost:5000/api/students/register", {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students/register`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push("/login");
        }, 2500);
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-sky-50 to-white px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Student Registration
        </h2>

        {/* Error */}
        {error && (
          <div className="text-red-600 text-sm mb-4 text-center bg-red-50 border border-red-200 rounded-md py-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Email + OTP button */}
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="button"
              onClick={sendOtp}
              disabled={otpTimer > 0}
              className={`flex items-center gap-1 px-4 rounded-lg font-semibold text-white transition ${
                otpTimer > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {otpTimer > 0 ? `${otpTimer}s` : otpSent ? "Resend" : "Send"}
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* OTP */}
          {otpSent && (
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
          )}

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Register
          </button>

          {/* Back to login */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Login
            </button>
          </p>
        </form>
      </div>

<Modal
  show={modal.show}
  type={modal.type}
  title={modal.title}
  message={modal.message}
  onClose={() => setModal({ ...modal, show: false })}
/>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center animate-fadeIn">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">
              Registration Successful 🎉
            </h3>
            <p className="text-gray-600 mb-4">Redirecting to login page...</p>
            <div className="animate-spin border-4 border-indigo-600 border-t-transparent rounded-full w-8 h-8 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
}
