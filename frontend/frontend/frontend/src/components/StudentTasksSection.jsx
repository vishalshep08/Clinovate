"use client";
import { useState, useEffect } from "react";

export default function StudentTasksSection({ student }) {
  const [tasks, setTasks] = useState([]);
  const [remarkFile, setRemarkFiles] = useState({}); 

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/tasks");
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleFileChange = (taskId, file) => {
    setRemarkFiles((prev) => ({ ...prev, [taskId]: file }));
  };
const handleRemarkUpload = async (taskId, status) => {
  if (status !== "Rejected")
    return openPopup("Upload Disabled", "You can only upload if your previous submission was rejected.");

  if (!remarkFile)
    return openPopup("No File Selected", "Please choose a file to upload.");

  const formData = new FormData();
  formData.append("file", remarkFile);
  formData.append("studentId", student?.id);

  try {
    const res = await fetch(`http://localhost:5000/api/student/tasks/remark/${taskId}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Upload failed");

    openPopup("Success", "Remark uploaded successfully!");
    setRemarkFile(null);
    fetchTasks();
  } catch (err) {
    console.error(err);
    openPopup("Error", err.message || "Failed to upload remark");
  }
};





  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-300">
      <h2 className="text-2xl font-bold text-[#004D40] mb-4">Assigned Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <div className="space-y-4">
          {/* {tasks.map((t) => (
            <div
              key={t.id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700 font-semibold">{t.title}</p>
                <a
                  href={`http://localhost:5000${t.fileUrl}`}
                  target="_blank"
                  className="text-blue-600 underline text-sm"
                >
                  View Task File
                </a>
                {t.remarkUrl && (
                  <p className="text-green-600 text-sm mt-1">
                    ✅ Remark uploaded
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(t.id, e.target.files[0])}
                  className="border p-2 rounded-lg"
                />
                <button
                  onClick={() => handleRemarkUpload(t.id)}
                  className="bg-[#004D40] text-white px-3 py-2 rounded-lg"
                >
                  Upload Remark
                </button>
              </div>
            </div>
          ))} */}
          {tasks.map((task) => (
  <li key={task.id} className="border-b py-3 flex justify-between items-center">
    <div>
      <p className="font-semibold text-gray-800">{task.title}</p>
      {task.fileUrl && (
        <a
          href={`http://localhost:5000${task.fileUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View Task
        </a>
      )}
      {task.feedback && task.status === "Rejected" && (
        <p className="text-red-600 text-sm mt-1">
          <strong>Feedback:</strong> {task.feedback}
        </p>
      )}
    </div>

    <div className="flex items-center gap-3">
      <input
        type="file"
        onChange={(e) => setRemarkFiles(e.target.files[0])}
        className="border p-2 rounded-lg text-sm"
        disabled={task.status !== "Rejected"}
      />
      <button
  onClick={() => handleRemarkUpload(task.id, task.status)}
  disabled={task.status !== "Rejected"}
  className={`px-3 py-2 rounded-lg font-semibold ${
    task.status === "Rejected"
      ? "bg-[#004D40] text-white hover:bg-[#26A69A]"
      : "bg-gray-400 text-gray-200 cursor-not-allowed"
  }`}
>
  {task.status === "Rejected" ? "Re-Upload" : "Upload Disabled"}
</button>

{task.feedback && task.status === "Rejected" && (
  <p className="text-red-600 text-sm mt-1">
    <strong>Feedback:</strong> {task.feedback}
  </p>
)}

    </div>
  </li>
))}

        </div>
      )}
    </div>
  );
}
