"use client";
import { useState, useEffect } from "react";
import Modal from "./Modal";

export default function SOPSection() {
  const [sops, setSops] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [editingSop, setEditingSop] = useState(null);

  // ✅ Modal state
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const API_BASE = process.env.NEXT_PUBLIC_process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const fetchSops = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/sops`);
      const data = await res.json();
      setSops(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching SOPs:", err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/sops/upload`, {
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
    } catch {
      setModal({
        show: true,
        title: "Upload Failed",
        message: "There was an issue uploading your SOP. Please try again.",
        onConfirm: () => setModal({ show: false }),
      });
    }
  };

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/sops/${sopId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (res.ok) {
        setEditingSop(null);
        setTitle("");
        fetchSops();
        setModal({
          show: true,
          title: "Updated",
          message: "SOP title updated successfully.",
          onConfirm: () => setModal({ show: false }),
        });
      } else throw new Error();
    } catch {
      setModal({
        show: true,
        title: "Update Failed",
        message: "Unable to update SOP. Please try again.",
        onConfirm: () => setModal({ show: false }),
      });
    }
  };

  const handleDelete = (sopId) => {
    setModal({
      show: true,
      title: "Confirm Delete",
      message: "Are you sure you want to delete this SOP?",
      onConfirm: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/sops/${sopId}`, {
            method: "DELETE",
          });
          if (res.ok) {
            fetchSops();
            setModal({
              show: true,
              title: "Deleted",
              message: "SOP deleted successfully.",
              onConfirm: () => setModal({ show: false }),
            });
          } else throw new Error();
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

  useEffect(() => {
    fetchSops();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-300">
      {/* ✅ Modal */}
      <Modal {...modal} onClose={() => setModal({ show: false })} />

      <h2 className="text-2xl font-bold text-[#004D40] mb-4">
        SOP Management
      </h2>

      {/* Upload form */}
      <form onSubmit={handleUpload} className="mb-6 flex gap-3 items-center">
        <input
          type="text"
          placeholder="Enter SOP title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded-lg w-1/3"
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded-lg"
        />
        <button
          type="submit"
          className="bg-[#004D40] text-white px-4 py-2 rounded-lg hover:bg-[#26A69A]"
        >
          Upload
        </button>
      </form>

      {sops.length === 0 ? (
        <p>No SOPs uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {sops.map((s) => (
            <li
              key={s.id}
              className="text-gray-700 border-b py-2 flex justify-between items-center"
            >
              {editingSop === s.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded-lg"
                    placeholder="Edit title"
                  />
                  <button
                    onClick={() => handleEdit(s.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingSop(null);
                      setTitle("");
                    }}
                    className="bg-gray-400 text-white px-3 py-1 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>{s.title}</span>
                  <div className="flex gap-3">
                    <a
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${s.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                    <button
                      onClick={() => {
                        setEditingSop(s.id);
                        setTitle(s.title);
                      }}
                      className="text-yellow-600 underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 underline"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
