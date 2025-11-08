"use client";
import { useState, useEffect } from "react";

export default function StudentSOPSection() {
  const [sops, setSops] = useState([]);

  const fetchSops = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/sops");
      const data = await res.json();
      setSops(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching SOPs:", err);
    }
  };

  useEffect(() => {
    fetchSops();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-300">
      <h2 className="text-2xl font-bold text-[#004D40] mb-4">Standard Operating Procedures (SOPs)</h2>
      {sops.length === 0 ? (
        <p>No SOPs available yet.</p>
      ) : (
        <ul className="space-y-2">
          {sops.map((s) => (
            <li key={s.id} className=" border-b py-2 flex justify-between items-center">
              <span className="text-gray-700">{s.title}</span>
              <a
                href={`http://localhost:5000${s.fileUrl}`}
                target="_blank"
                className="text-blue-600 underline"
              >
                View File
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
