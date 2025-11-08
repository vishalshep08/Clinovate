// "use client";
// import { useEffect } from "react";

// export default function AdminRequests({ requests, setRequests }) {
//   const fetchRequests = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/admin/requests");
//       const data = await res.json();
//       setRequests(data.requests || []);
//     } catch (err) {
//       console.error(err);
//       setRequests([]);
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
//       // alert(data.message);
//       fetchRequests();
//     } catch (err) {
//       console.error(err);
//       // alert("Server error");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-300">
//       <h2 className="text-2xl font-bold text-[#004D40] mb-4">Enrollment Requests</h2>

//       {(!requests || requests.length === 0) ? (
//         <p className="text-gray-700">No pending requests yet.</p>
//       ) : (
//         <table className="w-full border-collapse border border-gray-200 text-left">
//           <thead>
//             <tr className="bg-[#004D40] text-white">
//               <th className="p-3">ID</th>
//               <th className="p-3">Name</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requests.map((req) => (
//               <tr
//                 key={req.id}
//                 className={`border-b border-gray-200 ${
//                   req.status === "approved"
//                     ? "bg-green-100"
//                     : req.status === "rejected"
//                     ? "bg-red-100"
//                     : ""
//                 }`}
//               >
//                 <td className="p-3 text-gray-700">{req.id}</td>
//                 <td className="p-3 text-gray-700">{req.student.name}</td>
//                 <td className="p-3 text-gray-700">{req.student.email}</td>
//                 <td className="p-3 text-gray-700 capitalize font-semibold">
//                   {req.status}
//                 </td>
//                 <td className="p-3 text-gray-700 flex gap-2">
//                   {req.status === "pending" ? (
//                     <>
//                       <button
//                         className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
//                         onClick={() => handleAction(req.id, "approved")}
//                       >
//                         Approve
//                       </button>
//                       <button
//                         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                         onClick={() => handleAction(req.id, "rejected")}
//                       >
//                         Reject
//                       </button>
//                     </>
//                   ) : (
//                     <span>{req.status}</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect } from "react";

export default function AdminRequests({ requests, setRequests }) {
  const fetchRequests = async () => {
    try {
      // const res = await fetch("http://localhost:5000/api/admin/requests");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/requests`);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/requests/${id}`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await res.json();
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 transition-all hover:shadow-2xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#004D40] tracking-tight">
          Enrollment Requests
        </h2>
        <button
          onClick={fetchRequests}
          className="px-4 py-2 text-sm font-semibold bg-[#26A69A] text-white rounded-lg shadow-md hover:bg-[#00796B] transition-all duration-200"
        >
          Refresh
        </button>
      </div>

      {/* Table Section */}
      {!requests || requests.length === 0 ? (
        <p className="text-gray-700 text-center py-10 italic">
          No pending requests yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gradient-to-r from-[#26A69A] to-[#009688] text-white shadow-sm">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, i) => (
                <tr
                  key={req.id || i}
                  className={`border-b border-gray-100 transition-all duration-300 ${
                    req.status === "approved"
                      ? "bg-green-50"
                      : req.status === "rejected"
                      ? "bg-red-50"
                      : "hover:bg-[#E0F2F1] hover:shadow-sm"
                  }`}
                >
                  <td className="p-4 text-gray-800 font-medium">{req.id}</td>
                  <td className="p-4 text-gray-800">{req.student.name}</td>
                  <td className="p-4 text-gray-600">{req.student.email}</td>
                  <td className="p-4 capitalize font-semibold">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-3">
                    {req.status === "pending" ? (
                      <>
                        <button
                          className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-all duration-200"
                          onClick={() => handleAction(req.id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-all duration-200"
                          onClick={() => handleAction(req.id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-700">{req.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

