import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-around h-screen w-screen">
      <h2 className="absolute top-0 left-0 text-xl font-semibold bg-gray-600 p-5 m-2 rounded-full text-white">
        Login
      </h2>
      <div className="w-1/4 flex flex-col gap-5 justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <input
            className="text-xl h-14 rounded-xl p-4"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="text-xl h-14 rounded-xl p-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="rounded-xl">
            Login
          </button>
        </form>
        <p>
          New Here! <Link to={"/register"}>Create a New Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
