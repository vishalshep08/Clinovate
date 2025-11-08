"use client";
import { useState, useEffect } from "react";

export default function TasksSection() {
  const [tasks, setTasks] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [popup, setPopup] = useState({ show: false, title: "", message: "" });

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // ✅ Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/tasks`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // ✅ Upload a new task
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    try {
      await fetch(`${API_BASE}/api/admin/tasks/upload`, {
        method: "POST",
        body: formData,
      });
      setFile(null);
      setTitle("");
      fetchTasks();
      openPopup("Upload Successful", "Task uploaded successfully!");
    } catch {
      openPopup("Error", "Failed to upload task.");
    }
  };

  // ✅ Edit title
  const handleEdit = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        setEditingTask(null);
        setTitle("");
        fetchTasks();
        openPopup("Success", "Task title updated!");
      } else throw new Error();
    } catch {
      openPopup("Error", "Failed to update title.");
    }
  };

  // ✅ Delete task
  const handleDelete = (taskId) => {
    openPopup("Confirm Delete", "Are you sure you want to delete this task?", async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/tasks/${taskId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchTasks();
          openPopup("Deleted", "Task deleted successfully!");
        } else throw new Error();
      } catch {
        openPopup("Error", "Failed to delete task.");
      }
    });
  };

  // ✅ View student submissions
  const viewSubmissions = async (taskId) => {
    setSelectedTask(taskId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/tasks/submissions/${taskId}`);
      if (!res.ok) throw new Error("Failed to fetch submissions");
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      openPopup("Error", "Unable to load submissions.");
    }
  };

  // ✅ Update status (Accept/Reject)
  const updateStatus = async (submissionId, status) => {
    const body = { status };
    if (status === "Rejected") body.feedback = feedback;

    try {
      const res = await fetch(`${API_BASE}/api/admin/tasks/update-status/${submissionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        openPopup("Success", `Submission ${status}!`);
        setFeedback("");
        setSelectedSubmissionId(null);
        viewSubmissions(selectedTask);
      } else throw new Error();
    } catch {
      openPopup("Error", "Unable to update status.");
    }
  };

  // ✅ Popup modal
  const openPopup = (popupTitle, message, onConfirm = null) =>
    setPopup({ show: true, title: popupTitle, message, onConfirm });
  const closePopup = () => setPopup({ show: false, title: "", message: "", onConfirm: null });

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      {/* ✅ Popup Modal */}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-96 text-center">
            <h2 className="text-xl font-semibold text-[#004D40] mb-3">{popup.title}</h2>
            <p className="text-gray-700 mb-4">{popup.message}</p>
            <div className="flex justify-center gap-3">
              {popup.onConfirm ? (
                <>
                  <button
                    onClick={() => {
                      popup.onConfirm();
                      closePopup();
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={closePopup}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={closePopup}
                  className="bg-[#26A69A] text-white px-5 py-2 rounded-md font-medium hover:bg-[#00796B] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Header */}
      <h2 className="text-2xl font-semibold text-[#004D40] mb-6">Task Management</h2>

      {/* ✅ Upload Form */}
      <form onSubmit={handleUpload} className="flex flex-wrap items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:border-[#26A69A] focus:ring-1 focus:ring-[#26A69A] outline-none flex-1 min-w-[220px]"
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm cursor-pointer"
          required
        />
        <button
          type="submit"
          className="bg-[#26A69A] text-white px-5 py-2 rounded-md font-medium hover:bg-[#00796B] transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Upload
        </button>
      </form>

      {/* ✅ Tasks List */}
      {tasks.length === 0 ? (
        <p className="text-gray-500 italic text-center py-6">No tasks uploaded yet.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-all duration-200"
            >
              {editingTask === t.id ? (
                <div className="flex flex-wrap items-center gap-2 w-full">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:ring-1 focus:ring-[#26A69A] outline-none"
                  />
                  <button
                    onClick={() => handleEdit(t.id)}
                    className="bg-green-600 text-white px-4 py-1.5 rounded-full hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setTitle("");
                    }}
                    className="bg-gray-400 text-white px-4 py-1.5 rounded-full hover:bg-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-gray-800 font-medium">{t.title}</p>
                    <a
                      href={`${API_BASE}${t.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#26A69A] hover:text-[#00796B] text-sm font-medium transition-colors"
                    >
                      View Task File
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 sm:mt-0">
                    <button
                      onClick={() => {
                        setEditingTask(t.id);
                        setTitle(t.title);
                      }}
                      className="bg-yellow-400 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-yellow-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => viewSubmissions(t.id)}
                      className="bg-[#26A69A] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#00796B] transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      View Submissions
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Submissions Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-3/4 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-5 text-xl text-gray-600 hover:text-black transition"
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold text-[#004D40] mb-4">
              Student Submissions
            </h3>

            {submissions.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                No submissions available.
              </p>
            ) : (
              <table className="w-full border-collapse text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-[#26A69A] to-[#009688] text-white">
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left">File</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b hover:bg-[#E0F2F1] transition-all duration-200"
                    >
                      <td className="p-3 text-gray-800 font-medium">
                        {sub.studentName || "Unknown"}
                      </td>
                      <td className="p-3">
                        <a
                          href={`${API_BASE}${sub.remarkUrl.startsWith("/") ? sub.remarkUrl : "/" + sub.remarkUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#26A69A] hover:text-[#00796B] underline font-medium"
                        >
                          View File
                        </a>
                      </td>
                      <td className="p-3 text-gray-700">
                        {sub.status || "Pending"}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            onClick={() => updateStatus(sub.id, "Accepted")}
                            className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => setSelectedSubmissionId(sub.id)}
                            className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            Reject
                          </button>
                        </div>

                        {selectedSubmissionId === sub.id && (
                          <div className="mt-2">
                            <textarea
                              placeholder="Enter rejection feedback..."
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              className="border border-gray-300 w-full p-2 rounded-md text-sm mb-2 focus:ring-1 focus:ring-[#26A69A] outline-none"
                            />
                            <button
                              onClick={() => updateStatus(sub.id, "Rejected")}
                              className="bg-[#26A69A] text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-[#00796B] transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              Submit Feedback
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}