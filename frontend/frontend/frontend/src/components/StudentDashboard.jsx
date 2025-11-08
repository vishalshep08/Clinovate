"use client";
import { useState, useEffect } from "react";
import BackButton from "./BackButton";
import StudentSOPSection from "./StudentSOPSection";
import StudentTasksSection from "./StudentTasksSection";

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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#004D40] text-white flex flex-col">
        <BackButton label="Go Back" fallback="/" />
        <h1 className="text-2xl font-bold p-6 border-b border-[#26A69A]">
          Student Panel
        </h1>

        {/* Student Info */}
        {student && (
          <div className="p-4 border-b border-[#26A69A]">
            <p className="text-sm font-semibold text-[#A0F0E0]">
              {student.name || "Student"}
            </p>
            <p className="text-xs text-gray-200">{student.email}</p>
          </div>
        )}

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
        {activeTab === "sop" && <StudentSOPSection />}
        {activeTab === "tasks" && (
          <StudentTasksSection student={student} />
        )}
      </main>
    </div>
  );
}
