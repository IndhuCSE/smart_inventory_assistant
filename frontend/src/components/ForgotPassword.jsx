import { useState } from "react";
import logo from '../assets/logo.png'; 

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const editCredentials = (e) => {
        e.preventDefault();
        // Replace with actual auth logic
        alert(`Editing credentials for ${email}`);
    }
    return(
        <div className="h-screen w-screen flex items-center justify-center bg-white">
            <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo" className="h-20 w-auto" />
                </div>

                <h2 className="text-xl text-center text-gray-800 mb-8">Track Smarter, Stock Better!</h2>

                <form onSubmit={editCredentials} className="space-y-6">
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
                        <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Reset Password</button>
                </form>
            </div>
        </div>
    );
}

