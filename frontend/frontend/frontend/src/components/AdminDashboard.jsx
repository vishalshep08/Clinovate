// "use client"; 
// import { useState, useEffect } from "react";
// import AdminRequests from "./AdminRequests";

// export default function AdminDashboard({ onLogout }) {
//   const [activeTab, setActiveTab] = useState("requests");
//   const [requests, setRequests] = useState([]);
//   const [students, setStudents] = useState([]);

//   // Fetch enrolled students
//   const fetchStudents = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/admin/students");
//       const data = await res.json();
//       setStudents(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Requests fetch for dashboard tab
//   const fetchRequests = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/admin/requests");
//       const data = await res.json();
//       setRequests(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === "requests") fetchRequests();
//     else if (activeTab === "students") fetchStudents();
//   }, [activeTab]);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#004D40] text-white flex flex-col">
//         <h1 className="text-2xl font-bold p-6">Admin Panel</h1>
//         <nav className="flex flex-col gap-2 p-4">
//           <button
//             className={`text-left p-3 rounded-lg hover:bg-[#26A69A] transition ${
//               activeTab === "requests" ? "bg-[#26A69A]" : ""
//             }`}
//             onClick={() => setActiveTab("requests")}
//           >
//             Enrollment Requests
//           </button>
//           <button
//             className={`text-left p-3 rounded-lg hover:bg-[#26A69A] transition ${
//               activeTab === "students" ? "bg-[#26A69A]" : ""
//             }`}
//             onClick={() => setActiveTab("students")}
//           >
//             Enrolled Students
//           </button>
//           <button
//             className="text-left p-3 rounded-lg hover:bg-[#26A69A] transition mt-6 bg-red-600 hover:bg-red-500"
//             onClick={onLogout}
//           >
//             Logout
//           </button>
//         </nav>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 flex flex-col">
//         {/* Navbar/Header */}
//         <header className="flex justify-between items-center bg-white p-4 shadow-md border-b border-gray-200">
//           <h1 className="text-xl font-semibold text-[#004D40]">
//             {activeTab === "requests" ? "Enrollment Requests" : "Enrolled Students"}
//           </h1>
//           <button
//             className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
//             onClick={onLogout}
//           >
//             Logout
//           </button>
//         </header>

//         <div className="p-6 flex-1 overflow-auto">
//           {activeTab === "requests" && (
//             <AdminRequests requests={requests} setRequests={setRequests} />
//           )}

//           {activeTab === "students" && (
//             <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-300">
//               <table className="w-full border-collapse border border-gray-200 text-left">
//                 <thead>
//                   <tr className="bg-[#004D40] text-white">
//                     <th className="p-3">ID</th>
//                     <th className="p-3">Name</th>
//                     <th className="p-3">Email</th>
//                     <th className="p-3">Status</th>
//                     <th className="p-3">Enrolled At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} className="p-3 text-center text-gray-600">
//                         No students enrolled yet.
//                       </td>
//                     </tr>
//                   ) : (
//                     students.map((stu) => (
//                       <tr
//                         key={stu.id}
//                         className="border-b border-gray-200 hover:bg-gray-100"
//                       >
//                         <td className="p-3">{stu.id}</td>
//                         <td className="p-3">{stu.name}</td>
//                         <td className="p-3">{stu.email}</td>
//                         <td className="p-3 capitalize">{stu.status || "enrolled"}</td>
//                         <td className="p-3">
//                           {new Date(stu.createdAt).toLocaleDateString()}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import AdminRequests from "./AdminRequests";
import BackButton from "./BackButton";
import SOPSection from "./SOPSection";
import TasksSection from "./TasksSection";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);

  // Fetch requests
  const fetchRequests = async () => {
    try {
      // const res = await fetch("http://localhost:5000/api/admin/requests");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/requests`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  body: JSON.stringify({ email }),
});

      const data = await res.json();
      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // Fetch enrolled students
  const fetchStudents = async () => {
    try {
      // const res = await fetch("http://localhost:5000/api/admin/students");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/student`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  body: JSON.stringify({ email }),
});

      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "requests") fetchRequests();
    if (activeTab === "students") fetchStudents();
  }, [activeTab]);

  const tabs = [
    { key: "requests", label: "Enrollment Requests" },
    { key: "students", label: "Enrolled Students" },
    { key: "sop", label: "SOP" },
    { key: "tasks", label: "Tasks" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#004D40] text-white flex flex-col">
        <BackButton label="Go Back" fallback="/" />
        <h1 className="text-2xl font-bold p-6">Admin Panel</h1>
        <nav className="flex flex-col gap-2 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`text-left p-3 rounded-lg hover:bg-[#26A69A] transition ${
                activeTab === tab.key ? "bg-[#26A69A]" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}

          <button
            className="text-left p-3 rounded-lg hover:bg-red-500 transition mt-6 bg-red-600"
            onClick={onLogout}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "requests" && (
          <AdminRequests requests={requests} setRequests={setRequests} />
        )}

        {activeTab === "students" && (
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-300">
            <h2 className="text-2xl font-bold text-[#004D40] mb-4">
              Enrolled Students
            </h2>
            {students.length === 0 ? (
              <p>No students enrolled yet.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-200 text-left">
                <thead>
                  <tr className="bg-[#004D40] text-white">
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((stu) => (
                    <tr
                      key={stu.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="p-3 text-gray-600">{stu.id}</td>
                      <td className="p-3 text-gray-600">{stu.name}</td>
                      <td className="p-3 text-gray-600">{stu.email}</td>
                      <td className="p-3 text-gray-600">
                        {new Date(stu.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "sop" && <SOPSection />}
        {activeTab === "tasks" && <TasksSection />}
      </main>
    </div>
  );
}
