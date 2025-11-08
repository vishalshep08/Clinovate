"use client";
import React from "react";

export default function Modal({
  show,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96 animate-fadeIn">
        <h3 className="text-xl font-semibold text-[#004D40] mb-3">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          {onConfirm ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-[#004D40] text-white hover:bg-[#26A69A]"
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#004D40] text-white hover:bg-[#26A69A]"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
