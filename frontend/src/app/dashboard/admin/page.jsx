"use client";

import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  ClipboardList,
  GraduationCap,
  LogOut,
} from "lucide-react";
import AdminRequests from "./requests/page";
import BackButton from "../../../components/BackButton";
import SOPSection from "./sops/page";
import TasksSection from "./tasks/page";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/requests`
      );
      const data = await res.json();
      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // Fetch enrolled students
  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/students`
      );
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

  // Simple logout handler (optional)
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const tabs = [
    { key: "requests", label: "Enrollment Requests", icon: Users },
    { key: "students", label: "Enrolled Students", icon: GraduationCap },
    { key: "sop", label: "SOP", icon: FileText },
    { key: "tasks", label: "Tasks", icon: ClipboardList },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#004D40] to-[#00796B] text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/20">
          <BackButton label="Go Back" fallback="/" />
          <h1 className="text-2xl font-extrabold mt-4 text-center tracking-wide">
            Admin Panel
          </h1>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#004D40] shadow-md scale-[1.03]"
                    : "text-white/80 hover:bg-white/10 hover:text-white hover:scale-[1.02]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-[#004D40]" : ""}`}
                />
                {tab.label}
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold mt-8 bg-red-600 hover:bg-red-500 transition-all duration-200 shadow-md hover:scale-[1.03]"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "requests" && (
          <AdminRequests requests={requests} setRequests={setRequests} />
        )}

        {activeTab === "students" && (
          <div>
            <h2 className="text-2xl font-bold text-[#004D40] mb-6 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-[#004D40]" />
              Enrolled Students
            </h2>

            {students.length === 0 ? (
              <p className="text-gray-600 text-center py-10 italic">
                No students enrolled yet.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#26A69A] to-[#009688] text-white shadow-sm">
                      <th className="p-4 font-semibold text-left">ID</th>
                      <th className="p-4 font-semibold text-left">Name</th>
                      <th className="p-4 font-semibold text-left">Email</th>
                      <th className="p-4 font-semibold text-left">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((stu, i) => (
                      <tr
                        key={stu.id || i}
                        className="border-b border-gray-100 hover:bg-[#E0F2F1] hover:shadow-sm transition-all duration-300"
                      >
                        <td className="p-4 text-gray-700">{stu.id}</td>
                        <td className="p-4 text-gray-800 font-medium">
                          {stu.name}
                        </td>
                        <td className="p-4 text-gray-600">{stu.email}</td>
                        <td className="p-4 text-gray-600">
                          {new Date(stu.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "sop" && <SOPSection />}
        {activeTab === "tasks" && <TasksSection />}
      </main>
    </div>
  );
}
