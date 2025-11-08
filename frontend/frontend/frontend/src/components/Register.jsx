"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register({ onRegister }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const sendOtp = async () => {
    if (!email) return alert("Enter email first");

    try {
      // const res = await fetch("http://localhost:5000/api/students/send-otp", {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });


      const data = await res.json();
      console.log("OTP from backend:", data.otp);
      setOtpSent(true);
      alert("OTP sent! Check your email.");
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");
    if (!otpSent || !otp) return alert("Enter OTP");

    try {
      // const res = await fetch("http://localhost:5000/api/students/register", {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Show success modal
        setShowSuccessModal(true);
        if (onRegister) onRegister({ name: fullName, email });

        // ⏳ Auto close + redirect after 2.5 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push("/login");
        }, 2500);
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#A0F0E0] to-[#009688]">
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-[#004D40] mb-6">
          Student Registration
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-[#004D40] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-white"
            required
          />

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border border-[#004D40] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-white"
              required
            />
            <button
              type="button"
              onClick={sendOtp}
              className="bg-[#004D40] text-white px-4 rounded-lg font-semibold hover:bg-[#26A69A] transition"
            >
              {otpSent ? "Resend OTP" : "Send OTP"}
            </button>
          </div>

          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border border-[#004D40] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-white"
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#004D40] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-white"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-[#004D40] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-white"
            required
          />

          <button
            type="submit"
            className="bg-[#004D40] text-white py-3 rounded-lg font-semibold hover:bg-[#26A69A] transition"
          >
            Register
          </button>
        </form>
      </div>

      {/* ✅ Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center animate-fadeIn">
            <h3 className="text-xl font-semibold text-[#004D40] mb-2">
              Registration Successful 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              Redirecting to login page...
            </p>
            <div className="animate-spin border-4 border-[#004D40] border-t-transparent rounded-full w-8 h-8 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
}
