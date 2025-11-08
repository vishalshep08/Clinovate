"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false); // ✅ Added to prevent hydration mismatch
  const [userType, setUserType] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Run client-only logic after mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("clinovate_credentials");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEmail(parsed.email || "");
        setPassword(parsed.password || "");
        setUserType(parsed.userType || "admin");
        setRememberMe(true);
      } catch {
        localStorage.removeItem("clinovate_credentials");
      }
    }
  }, []);

  if (!mounted) return null; // ✅ Prevents SSR mismatch by rendering only after hydration

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const endpoint =
      userType === "admin"
        ? "/api/auth/admin-login"
        : "/api/auth/student-login";

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        if (rememberMe) {
          localStorage.setItem(
            "clinovate_credentials",
            JSON.stringify({ email, password, userType })
          );
        } else {
          localStorage.removeItem("clinovate_credentials");
        }

        localStorage.setItem(
          "user",
          JSON.stringify({ id: data.id, ...data, userType })
        );

        const redirectParam = searchParams.get("redirect");
        const defaultRedirect =
          userType === "admin" ? "/dashboard/admin" : "/dashboard/student";

        router.push(redirectParam || defaultRedirect);
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-sky-50 to-white px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          {userType === "admin" ? "Admin Login" : "Student Login"}
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-6 py-2 font-semibold rounded-l-lg border transition-colors ${
              userType === "admin"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-indigo-600 border-gray-300 hover:bg-indigo-50"
            }`}
            onClick={() => setUserType("admin")}
            disabled={loading}
          >
            Admin
          </button>
          <button
            className={`px-6 py-2 font-semibold rounded-r-lg border transition-colors ${
              userType === "student"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-indigo-600 border-gray-300 hover:bg-indigo-50"
            }`}
            onClick={() => setUserType("student")}
            disabled={loading}
          >
            Student
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-red-600 text-sm mb-4 text-center bg-red-50 border border-red-200 rounded-md py-2 px-3">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
              disabled={loading}
            />
          </div>

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
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Remember me + Register */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-indigo-600"
                disabled={loading}
              />
              <span>Remember me</span>
            </label>

            {userType === "student" && (
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-indigo-600 hover:text-indigo-800 text-sm"
                disabled={loading}
              >
                Register Here!
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <p className="text-gray-500 text-xs mt-6">
        © {new Date().getFullYear()} Clinovate — All Rights Reserved
      </p>
    </div>
  );
}
