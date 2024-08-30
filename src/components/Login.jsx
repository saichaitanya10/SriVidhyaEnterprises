import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/upscale.png";

const Login = () => {
  // Hardcoded credentials
  const hardcodedUsername = "Srividhyaetp";
  const hardcodedPassword = "Vidhya*7036";

  // State for input fields and login status
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      navigate("/home"); // Redirect to home if already logged in
    } else {
      navigate("  ");
    }
  }, []);

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();

    // Check credentials
    if (username === hardcodedUsername && password === hardcodedPassword) {
      // Clear error message if any
      setError("");
      // Set login state in localStorage
      localStorage.setItem("isLoggedIn", "true");
      // Redirect to /home
      navigate("/home");
    } else {
      // Set error message
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen   backdrop-blur-xl">
      <div className="bg-white/50 p-8  shadow-md w-full gap-10  h-[28rem] rounded-3xl flex flex-col  justify-center  max-w-xl">
        <div className=" flex items-center justify-center ">
          <img src={img} className="  w-40 h-20" />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-lg font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-lg font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
