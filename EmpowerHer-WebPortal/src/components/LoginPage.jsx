import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from '../store/authSlice';
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../services/auth.services";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (role) {
            try {
                const authData = await authenticateUser(email, password);
                if (authData.role === role) {
                    dispatch(login({ role: authData.role, isAuthenticated: true, uid: authData.uid }));
                    navigate('/dashboard');
                } else {
                    alert("Role does not match our records. Please check and try again.");
                }
            } catch (error) {
                console.error("Login failed:", error.message);
            }
        } else {
            alert("Please select a role.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-6">
           
            <div className="flex flex-col items-center justify-center bg-purple-50 rounded-md py-10 px-5">
            <h2 className="text-3xl font-extrabold text-purple-800 mb-8">Login</h2>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-72 p-3 mb-5 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-72 p-3 mb-5 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300"
                />
                
                <div className="flex space-x-8 mb-6">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={role === "police"}
                            onChange={() => setRole(role === "police" ? '' : 'police')}
                            className="form-checkbox h-6 w-6 text-purple-600 rounded-md"
                        />
                        <span className="text-gray-700 font-medium">Police</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={role === "ngo"}
                            onChange={() => setRole(role === "ngo" ? '' : 'ngo')}
                            className="form-checkbox h-6 w-6 text-purple-600 rounded-md"
                        />
                        <span className="text-gray-700 font-medium">NGO</span>
                    </label>
                </div>
                
                <button
                    onClick={handleLogin}
                    className="w-72 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 transition duration-300"
                >
                    Login
                </button>
            </div>
            
        </div>
    );
};

export default LoginPage;
