// "use client";
// import { useState, useEffect } from "react";

// export default function StudentTasksSection({ student }) {
//   const [tasks, setTasks] = useState([]);
//   const [submissions, setSubmissions] = useState([]);
//   const [files, setFiles] = useState({});
//   const [currentStudent, setCurrentStudent] = useState(student || null); // ✅ renamed

//   // 🧠 Fetch student data from localStorage
//   useEffect(() => {
//     if (!student) {
//       const savedUser = JSON.parse(localStorage.getItem("user"));
//       if (savedUser) {
//         setCurrentStudent(savedUser);
//       }
//     }
//   }, [student]);

//   // 🧠 Fetch all tasks
//   const fetchTasks = async () => {
//     const res = await fetch("http://localhost:5000/api/admin/tasks");
//     const data = await res.json();
//     setTasks(Array.isArray(data) ? data : []);
//   };

//   // 🧠 Fetch current student's submissions
//   const fetchSubmissions = async () => {
//     if (!currentStudent?.id) return; // ✅ avoid undefined id
//     const res = await fetch(
//       `http://localhost:5000/api/student/tasks/my-submissions/${currentStudent.id}`
//     );
//     const data = await res.json();
//     setSubmissions(Array.isArray(data) ? data : []);
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   useEffect(() => {
//     if (currentStudent?.id) fetchSubmissions();
//   }, [currentStudent]);

//   // 🧮 Helper to get current student's submission for a task
//   const getSubmissionForTask = (taskId) =>
//     submissions.find((s) => s.taskId === taskId);

//   const handleFileChange = (taskId, file) => {
//     setFiles((prev) => ({ ...prev, [taskId]: file }));
//   };

//   const handleUpload = async (taskId) => {
//     const file = files[taskId];
//     if (!file) return alert("Please select a file.");
//     if (!currentStudent?.id) return alert("Student ID missing.");

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("studentId", currentStudent.id);

//     console.log("🧠 Uploading", { currentStudent, taskId });

//     const res = await fetch(
//       `http://localhost:5000/api/student/tasks/submit/${taskId}`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await res.json();
//     if (res.ok) {
//       alert("Uploaded successfully!");
//       fetchSubmissions(); // refresh
//     } else {
//       alert(data.error || "Upload failed");
//     }
//   };

//   // ✅ UI remains same...


//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md">
//       <h2 className="text-2xl font-bold text-[#004D40] mb-4">
//         Your Assigned Tasks
//       </h2>

//       {tasks.length === 0 ? (
//         <p>No tasks available yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {tasks.map((task) => {
//             const submission = getSubmissionForTask(task.id);
//             const canUpload =
//               !submission || submission.status === "Rejected";

//             return (
//               <li
//                 key={task.id}
//                 className="border p-4 rounded-lg flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-semibold text-gray-800">{task.title}</p>
//                   <a
//                     href={`http://localhost:5000${task.fileUrl}`}
//                     target="_blank"
//                     className="text-blue-600 underline text-sm"
//                   >
//                     View Task
//                   </a>

//                   {submission && (
//                     <p className="text-sm mt-1">
//                       Status:{" "}
//                       <span
//                         className={`font-semibold ${
//                           submission.status === "Accepted"
//                             ? "text-green-600"
//                             : submission.status === "Rejected"
//                             ? "text-red-600"
//                             : "text-yellow-600"
//                         }`}
//                       >
//                         {submission.status}
//                       </span>
//                     </p>
//                   )}

//                   {submission?.feedback && (
//                     <p className="text-xs text-gray-700 italic mt-1">
//                       💬 {submission.feedback}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <input
//                     type="file"
//                     onChange={(e) =>
//                       handleFileChange(task.id, e.target.files[0])
//                     }
//                     className="border p-2 rounded-md text-sm"
//                     disabled={!canUpload}
//                   />
//                   <button
//                     onClick={() => handleUpload(task.id)}
//                     disabled={!canUpload}
//                     className={`px-3 py-2 rounded-lg font-semibold ${
//                       canUpload
//                         ? "bg-[#004D40] text-white hover:bg-[#26A69A]"
//                         : "bg-gray-400 text-gray-200 cursor-not-allowed"
//                     }`}
//                   >
//                     {submission
//                       ? submission.status === "Rejected"
//                         ? "Re-upload"
//                         : "Uploaded"
//                       : "Upload"}
//                   </button>
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from "react";

export default function StudentTasksSection({ student }) {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [files, setFiles] = useState({});
  const [currentStudent, setCurrentStudent] = useState(student || null); // ✅ renamed

  // 🧠 Fetch student data from localStorage
  useEffect(() => {
    if (!student) {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        setCurrentStudent(savedUser);
      }
    }
  }, [student]);

  // 🧠 Fetch all tasks
  const fetchTasks = async () => {
    // const res = await fetch("http://localhost:5000/api/admin/tasks");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/tasks`);

    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };

  // 🧠 Fetch current student's submissions
  const fetchSubmissions = async () => {
    if (!currentStudent?.id) return; // ✅ avoid undefined id
    const res = await fetch(
      // `http://localhost:5000/api/student/tasks/my-submissions/${currentStudent.id}`
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/tasks/my-submissions/${currentStudent.id}`
    );
    const data = await res.json();
    setSubmissions(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (currentStudent?.id) fetchSubmissions();
  }, [currentStudent]);

  // 🧮 Helper to get current student's submission for a task
  const getSubmissionForTask = (taskId) =>
    submissions.find((s) => s.taskId === taskId);

  const handleFileChange = (taskId, file) => {
    setFiles((prev) => ({ ...prev, [taskId]: file }));
  };

  const handleUpload = async (taskId) => {
    const file = files[taskId];
    if (!file) return alert("Please select a file.");
    if (!currentStudent?.id) return alert("Student ID missing.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentId", currentStudent.id);

    console.log("🧠 Uploading", { currentStudent, taskId });

    const res = await fetch(
      // `http://localhost:5000/api/student/tasks/submit/${taskId}`,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/tasks/submit/${taskId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (res.ok) {
      alert("Uploaded successfully!");
      fetchSubmissions(); // refresh
    } else {
      alert(data.error || "Upload failed");
    }
  };


  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[#004D40] mb-4">
        Your Assigned Tasks
      </h2>

      {tasks.length === 0 ? (
        <p>No tasks available yet.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => {
            const submission = getSubmissionForTask(task.id);
            const canUpload =
              !submission || submission.status === "Rejected";

            return (
              <li
                key={task.id}
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">{task.title}</p>
                  <a
                    href={`http://localhost:5000${task.fileUrl}`}
                    target="_blank"
                    className="text-blue-600 underline text-sm"
                  >
                    View Task
                  </a>

                  {submission && (
                    <p className="text-sm mt-1 text-gray-700">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          submission.status === "Accepted"
                            ? "text-green-600"
                            : submission.status === "Rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </p>
                  )}

                  {submission?.feedback && (
                    <p className="text-xs text-gray-700 italic mt-1">
                      💬 {submission.feedback}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(task.id, e.target.files[0])
                    }
                    className="border p-2 rounded-md text-sm"
                    disabled={!canUpload}
                  />
                  <button
                    onClick={() => handleUpload(task.id)}
                    disabled={!canUpload}
                    className={`px-3 py-2 rounded-lg font-semibold ${
                      canUpload
                        ? "bg-[#004D40] text-white hover:bg-[#26A69A]"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                  >
                    {submission
                      ? submission.status === "Rejected"
                        ? "Re-upload"
                        : "Uploaded"
                      : "Upload"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
