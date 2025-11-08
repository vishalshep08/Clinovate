// "use client";
// import React from "react";

// export default function Modal({
//   show,
//   title,
//   message,
//   onClose,
//   onConfirm,
//   confirmText = "OK",
//   cancelText = "Cancel",
// }) {
//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//       <div className="bg-white p-6 rounded-2xl shadow-xl w-96 animate-fadeIn">
//         <h3 className="text-xl font-semibold text-[#004D40] mb-3">{title}</h3>
//         <p className="text-gray-700 mb-6">{message}</p>

//         <div className="flex justify-end gap-3">
//           {onConfirm ? (
//             <>
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
//               >
//                 {cancelText}
//               </button>
//               <button
//                 onClick={onConfirm}
//                 className="px-4 py-2 rounded-lg bg-[#004D40] text-white hover:bg-[#26A69A]"
//               >
//                 {confirmText}
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={onClose}
//               className="px-4 py-2 rounded-lg bg-[#004D40] text-white hover:bg-[#26A69A]"
//             >
//               {confirmText}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

export default function Modal({ show, type = "info", title, message, onClose }) {
  if (!show) return null;

  const icons = {
    success: <CheckCircle2 className="text-green-500 w-10 h-10 mx-auto mb-2" />,
    error: <XCircle className="text-red-500 w-10 h-10 mx-auto mb-2" />,
    warning: <AlertTriangle className="text-yellow-500 w-10 h-10 mx-auto mb-2" />,
    info: <Info className="text-blue-500 w-10 h-10 mx-auto mb-2" />,
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {icons[type]}
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-2 mb-4">{message}</p>
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
