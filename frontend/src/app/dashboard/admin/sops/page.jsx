"use client";
import { useState, useEffect } from "react";
import Modal from "../../../../components/Modal";

export default function SOPSection() {
  const [sops, setSops] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [editingSop, setEditingSop] = useState(null);
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // ✅ Use correct environment variable or fallback to localhost
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // ✅ Fetch all SOPs
  const fetchSops = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/sops`);
      const data = await res.json();
      setSops(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching SOPs:", err);
    }
  };

  // ✅ Handle Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await fetch(`${API_BASE}/api/admin/sops/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      setFile(null);
      setTitle("");
      fetchSops();

      setModal({
        show: true,
        title: "Upload Successful",
        message: "Your SOP has been uploaded successfully.",
        onConfirm: () => setModal({ show: false }),
      });
    } catch (err) {
      console.error("Upload error:", err);
      setModal({
        show: true,
        title: "Upload Failed",
        message: "There was an issue uploading your SOP. Please try again.",
        onConfirm: () => setModal({ show: false }),
      });
    }
  };

  // ✅ Handle Edit
  const handleEdit = async (sopId) => {
    if (!title.trim()) {
      setModal({
        show: true,
        title: "Missing Title",
        message: "Please enter a valid title before saving.",
        onConfirm: () => setModal({ show: false }),
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/sops/${sopId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error();

      setEditingSop(null);
      setTitle("");
      fetchSops();

      setModal({
        show: true,
        title: "Updated",
        message: "SOP title updated successfully.",
        onConfirm: () => setModal({ show: false }),
      });
    } catch {
      setModal({
        show: true,
        title: "Update Failed",
        message: "Unable to update SOP. Please try again.",
        onConfirm: () => setModal({ show: false }),
      });
    }
  };

  // ✅ Handle Delete
  const handleDelete = (sopId) => {
    setModal({
      show: true,
      title: "Confirm Delete",
      message: "Are you sure you want to delete this SOP?",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/api/admin/sops/${sopId}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error();

          fetchSops();
          setModal({
            show: true,
            title: "Deleted",
            message: "SOP deleted successfully.",
            onConfirm: () => setModal({ show: false }),
          });
        } catch {
          setModal({
            show: true,
            title: "Error",
            message: "Failed to delete SOP.",
            onConfirm: () => setModal({ show: false }),
          });
        }
      },
    });
  };

  // ✅ Load on mount
  useEffect(() => {
    fetchSops();
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      <Modal {...modal} onClose={() => setModal({ show: false })} />

      <h2 className="text-2xl font-semibold text-[#004D40] mb-6">
        SOP Management
      </h2>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="flex flex-wrap items-center gap-3 mb-8"
      >
        <input
          type="text"
          placeholder="Enter SOP title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:border-[#26A69A] focus:ring-1 focus:ring-[#26A69A] outline-none flex-1 min-w-[220px]"
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm cursor-pointer"
        />
        <button
          type="submit"
          className="bg-[#26A69A] text-white px-5 py-2 rounded-md font-medium hover:bg-[#00796B] transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Upload
        </button>
      </form>

      {/* SOP List */}
      {sops.length === 0 ? (
        <p className="text-gray-500 italic text-center py-8">
          No SOPs uploaded yet.
        </p>
      ) : (
        <div className="divide-y divide-gray-200">
          {sops.map((s) => (
            <div
              key={s.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 hover:bg-gray-50 px-3 rounded-md transition-all duration-200"
            >
              {editingSop === s.id ? (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-[#26A69A] outline-none"
                    placeholder="Edit title"
                  />
                  <button
                    onClick={() => handleEdit(s.id)}
                    className="bg-green-600 text-white px-4 py-1.5 rounded-full hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingSop(null);
                      setTitle("");
                    }}
                    className="bg-gray-400 text-white px-4 py-1.5 rounded-full hover:bg-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium text-gray-800">{s.title}</span>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <a
                      href={`${API_BASE}${s.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#26A69A] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#00796B] transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      View
                    </a>
                    <button
                      onClick={() => {
                        setEditingSop(s.id);
                        setTitle(s.title);
                      }}
                      className="bg-yellow-400 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-yellow-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
