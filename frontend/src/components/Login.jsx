import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Replace with actual auth logic
    alert(`Logging in as ${email}`);
  };

  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-20 w-auto" />
        </div>

        <h2 className="text-xl text-center text-gray-800 mb-8">Track Smarter, Stock Better!</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            />
          </div>

          <div className="flex justify-center text-sm">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-gray-500 hover:underline font-medium bg-white"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
