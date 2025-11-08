"use client";
import { useState } from "react";

export default function Login({ onLogin, onShowRegister }) {
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint =
      userType === "admin"
        ? "/api/auth/admin-login"
        : "/api/auth/student-login";

    try {
      // const res = await fetch(`http://localhost:5000${endpoint}`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  body: JSON.stringify({ email }),
});


      const data = await res.json();
      if (res.ok) {
        onLogin({ ...data, userType });
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#A0F0E0] to-[#009688]">
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-[#004D40] mb-4">
          {userType === "admin" ? "Admin Login" : "Student Login"}
        </h2>

        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              userType === "admin"
                ? "bg-[#004D40] text-white shadow-md"
                : "bg-[#A0F0E0] text-[#004D40] border border-[#004D40] hover:bg-[#004D40] hover:text-white"
            }`}
            onClick={() => setUserType("admin")}
          >
            Admin
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              userType === "student"
                ? "bg-[#004D40] text-white shadow-md"
                : "bg-[#A0F0E0] text-[#004D40] border border-[#004D40] hover:bg-[#004D40] hover:text-white"
            }`}
            onClick={() => setUserType("student")}
          >
            Student
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#004D40] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#004D40] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D40] bg-white"
            required
          />

          <button
            type="submit"
            className="bg-[#004D40] text-white py-3 rounded-lg font-semibold hover:bg-[#26A69A] transition"
          >
            Login
          </button>
        </form>

        {userType === "student" && (
          <div className="text-center mt-4">
            <button
              className="text-[#004D40] underline hover:text-[#26A69A] transition"
              onClick={onShowRegister}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
