// "use client";
// import { useEffect, useState } from "react";

// export default function AdminRequests({ requests, setRequests }) {
//   const fetchRequests = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/admin/requests");
//       const data = await res.json();
//       setRequests(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const handleAction = async (id, status) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/admin/requests/${id}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status }),
//       });
//       const data = await res.json();
//       alert(data.message);
//       fetchRequests();
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#A0F0E0] to-[#009688] p-6">
//       <h1 className="text-3xl font-bold text-[#004D40] mb-4">Admin Dashboard</h1>
//       <h2 className="text-xl text-[#004D40] mb-6">Enrollment Requests</h2>

//       <div className="bg-white p-4 rounded-lg shadow-md">
//         {requests.length === 0 && <p>No requests yet.</p>}
//         {requests.map((req) => (
//           <div
//             key={req.id}
//             className="flex justify-between items-center border-b py-2 last:border-b-0"
//           >
//             <span>{req.student.name} ({req.student.email})</span>
//             <div className="flex gap-2">
//               {req.status === "pending" && (
//                 <>
//                   <button
//                     className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
//                     onClick={() => handleAction(req.id, "accepted")}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
//                     onClick={() => handleAction(req.id, "declined")}
//                   >
//                     Decline
//                   </button>
//                 </>
//               )}
//               {req.status !== "pending" && <span>{req.status}</span>}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect } from "react";

export default function AdminRequests({ requests, setRequests }) {
  const fetchRequests = async () => {
    try {
      // const res = await fetch("http://localhost:5000/api/admin/requests");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/requests`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  body: JSON.stringify({ email }),
});

      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    try {
      // const res = await fetch(`http://localhost:5000/api/admin/requests/${id}`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ status }),
      // });
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/requests/${id}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  body: JSON.stringify({ email }),
});

      const data = await res.json();
      // alert(data.message);
      fetchRequests();
    } catch (err) {
      console.error(err);
      // alert("Server error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-300">
      <h2 className="text-2xl font-bold text-[#004D40] mb-4">Enrollment Requests</h2>

      {(!requests || requests.length === 0) ? (
        <p className="text-gray-700">No pending requests yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-left">
          <thead>
            <tr className="bg-[#004D40] text-white">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.id}
                className={`border-b border-gray-200 ${
                  req.status === "approved"
                    ? "bg-green-100"
                    : req.status === "rejected"
                    ? "bg-red-100"
                    : ""
                }`}
              >
                <td className="p-3 text-gray-700">{req.id}</td>
                <td className="p-3 text-gray-700">{req.student.name}</td>
                <td className="p-3 text-gray-700">{req.student.email}</td>
                <td className="p-3 text-gray-700 capitalize font-semibold">
                  {req.status}
                </td>
                <td className="p-3 text-gray-700 flex gap-2">
                  {req.status === "pending" ? (
                    <>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                        onClick={() => handleAction(req.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => handleAction(req.id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>{req.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
