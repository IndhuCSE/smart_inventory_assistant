// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";

// export default function Register() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("staff");
//   const navigate = useNavigate();

//   // Redirect to login if not logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("You must be logged in as store manager to register users.");
//       navigate("/login");
//     }
//   }, [navigate]);

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://127.0.0.1:8000/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           username,
//           password,
//           role,
//         }),
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.detail || "Registration failed");
//       }

//       alert("Registration successful!");
//       navigate("/home");
//     } catch (error) {
//       alert(error.message || "Error connecting to server");
//     }
//   };

//   return (
//     <div className="h-screen w-screen flex items-center justify-center bg-white">
//       <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        
//         <div className="flex justify-center mb-6">
//           <img src={logo} alt="Logo" className="h-20 w-auto" />
//         </div>

//         <h2 className="text-xl text-center text-gray-800 mb-8">Create an Account</h2>

//         <form onSubmit={handleRegister} className="space-y-6">
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Username</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
//             />
//           </div>

//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
//             />
//           </div>

//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
//             >
//               <option value="store_manager">Store Manager</option>
//               <option value="staff">Staff</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition duration-200"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in as store manager to register users.");
      navigate("/login");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Registration failed");
      }

      alert("Registration successful!");
      navigate("/home");
    } catch (error) {
      alert(error.message || "Error connecting to server");
    }
  };

  return (
    <div className="flex min-h-screen bg-white  overflow-hidden">
      {/* Sidebar Placeholder */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        {/* Your sidebar component or nav items go here */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-20 w-auto" />
          </div>

          <h2 className="text-xl text-center text-gray-800 mb-8">Create an Account</h2>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              >
                <option value="store_manager">Store Manager</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition duration-200"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
