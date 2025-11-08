// "use client";
// import { useState, useEffect } from "react";
// import BackButton from "../../../components/BackButton";
// import StudentSOPSection from "./sops/page";
// import StudentTasksSection from "./tasks/page";

// export default function StudentDashboard({ onLogout }) {
//   const [activeTab, setActiveTab] = useState("sop");
//   const [student, setStudent] = useState(null);

//   const tabs = [
//     { key: "sop", label: "SOP" },
//     { key: "tasks", label: "Tasks" },
//   ];

//   // Load student info from localStorage on mount
//   useEffect(() => {
//     const saved = localStorage.getItem("user");
//     if (saved) {
//       setStudent(JSON.parse(saved));
//     }
//   }, []);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#004D40] text-white flex flex-col">
//         <BackButton label="Go Back" fallback="/" />
//         <h1 className="text-2xl font-bold p-6 border-b border-[#26A69A]">
//           Student Panel
//         </h1>

//         {/* Student Info */}
//         {student && (
//           <div className="p-4 border-b border-[#26A69A]">
//             <p className="text-sm font-semibold text-[#A0F0E0]">
//               {student.name || "Student"}
//             </p>
//             <p className="text-xs text-gray-200">{student.email}</p>
//           </div>
//         )}

//         <nav className="flex flex-col gap-2 p-4">
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               className={`text-left p-3 rounded-lg hover:bg-[#26A69A] transition ${
//                 activeTab === tab.key ? "bg-[#26A69A]" : ""
//               }`}
//               onClick={() => setActiveTab(tab.key)}
//             >
//               {tab.label}
//             </button>
//           ))}

//           <button
//             className="text-left p-3 rounded-lg hover:bg-red-500 transition mt-6 bg-red-600"
//             onClick={onLogout}
//           >
//             Logout
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         {activeTab === "sop" && <StudentSOPSection />}
//         {activeTab === "tasks" && (
//           <StudentTasksSection student={student} />
//         )}
//       </main>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import BackButton from "../../../components/BackButton";
import StudentSOPSection from "./sops/page";
import StudentTasksSection from "./tasks/page";

export default function StudentDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("sop");
  const [student, setStudent] = useState(null);

  const tabs = [
    { key: "sop", label: "SOP" },
    { key: "tasks", label: "Tasks" },
  ];

  // Load student info from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setStudent(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#004D40] to-[#00796B] text-white flex flex-col shadow-xl">
        <div className="p-4 border-b border-white/20">
          <BackButton label="Go Back" fallback="/" />
        </div>

        <div className="px-6 py-4 border-b border-white/20">
          <h1 className="text-2xl font-extrabold tracking-wide text-center">
            Student Panel
          </h1>
        </div>

        {/* Student Info */}
        {student && (
          <div className="p-4 text-center border-b border-white/20">
            <p className="font-semibold text-white text-lg">
              {student.name || "Student"}
            </p>
            <p className="text-sm text-white/80">{student.email}</p>
          </div>
        )}

        <nav className="flex flex-col gap-2 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-white text-[#004D40] shadow-md scale-[1.03]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={onLogout}
            className="mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-500 transition-all duration-200 shadow-md hover:scale-[1.02]"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 p-8 transition-all duration-300 hover:shadow-2xl">
          {activeTab === "sop" && <StudentSOPSection />}
          {activeTab === "tasks" && <StudentTasksSection student={student} />}
        </div>
      </main>
    </div>
  );
}
