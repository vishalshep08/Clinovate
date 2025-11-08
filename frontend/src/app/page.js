// Latest One

// "use client";
// import { useState } from "react";
// import SplashScreen from "../components/SplashScreen";
// import Login from "../components/Login";
// import Register from "../components/Register";
// import AdminDashboard from "../components/AdminDashboard";


// export default function Home() {
//   const [loading, setLoading] = useState(true);
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [showRegister, setShowRegister] = useState(false);
//   const [requests, setRequests] = useState([]); // Admin enrollment requests

//   // Handle login
//   const handleLogin = (data) => {
//     console.log("Login Data:", data); // replace with API call
//     setUserData(data);
//     setLoggedIn(true);
//   };

//   // Handle student registration
//   const handleRegister = (newStudent) => {
//     setRequests((prev) => [
//       ...prev,
//       { id: prev.length + 1, student: newStudent, status: "pending" },
//     ]);
//     setShowRegister(false);
//     alert("Registration request sent to Admin!");
//   };

//   // Handle logout
//   const handleLogout = () => {
//     setLoggedIn(false);
//     setUserData(null);
//   };

//   if (loading) {
//     return <SplashScreen onFinish={() => setLoading(false)} />;
//   }

//   // Show register page
//   if (!loggedIn && showRegister) {
//     return <Register onRegister={handleRegister} />;
//   }

//   // Show login page
//   if (!loggedIn) {
//     return <Login onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />;
//   }

//   // Admin dashboard
//  if (userData?.userType === "admin") {
//   return <AdminDashboard onLogout={handleLogout} />;
// }

//   // Student dashboard
//   return (
//     <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#A0F0E0] to-[#009688] p-6">
//       <h1 className="text-4xl font-bold text-[#004D40] mb-4">Welcome, {userData.email}</h1>
//       <p className="text-[#004D40] mb-6">Your trusted healthcare companion.</p>
//       <button
//         className="bg-[#004D40] text-white px-4 py-2 rounded hover:bg-[#26A69A] transition"
//         onClick={handleLogout}
//       >
//         Logout
//       </button>
//     </main>
//   );
// }


// "use client";
// import { useState, useEffect } from "react";
// import Login from "@/app/login/page";
// import Register from "@/app/register/page";
// import AdminDashboard from "@/app/dashboard/admin/page";
// import StudentDashboard from "@/app/dashboard/student/page";
// import SplashScreen from "@/app/SplashScreen";

// export default function HomePage() {
//   const [user, setUser] = useState(null);
//   const [showRegister, setShowRegister] = useState(false);

//   // Load user from localStorage (stay logged in on refresh)
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   const handleLogin = (userData) => {
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   if (loading) {
//     return <SplashScreen onFinish={() => setLoading(false)} />;
//   }
//   return (
//     <>
//       {/* No user logged in */}
//       {!user ? (
//         showRegister ? (
//           <Register onShowLogin={() => setShowRegister(false)} />
//         ) : (
//           <Login
//             onLogin={handleLogin}
//             onShowRegister={() => setShowRegister(true)}
//           />
//         )
//       ) : (
//         // When user is logged in → show correct dashboard
//         <>
//           {user.userType === "admin" ? (
//             <AdminDashboard onLogout={handleLogout} />
//           ) : (
//             <StudentDashboard onLogout={handleLogout} />
//           )}
//         </>
//       )}
//     </>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import Login from "@/app/login/page";
import Register from "@/app/register/page";
import AdminDashboard from "@/app/dashboard/admin/page";
import StudentDashboard from "@/app/dashboard/student/page";
import SplashScreen from "@/app/SplashScreen";

export default function HomePage() {
  // STATE
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Show SplashScreen briefly on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800); // 1.8s splash duration
    return () => clearTimeout(timer);
  }, []);

  // 🔹 Load user from localStorage (persist session)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 🔹 Handle Login
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔹 Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔹 SplashScreen shown first
  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  // 🔹 Conditional Rendering based on login state
  return (
    <>
      {/* No user logged in */}
      {!user ? (
        showRegister ? (
          <Register onShowLogin={() => setShowRegister(false)} />
        ) : (
          <Login
            onLogin={handleLogin}
            onShowRegister={() => setShowRegister(true)}
          />
        )
      ) : (
        // Logged-in users
        <>
          {user.userType === "admin" ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <StudentDashboard onLogout={handleLogout} />
          )}
        </>
      )}
    </>
  );
}
