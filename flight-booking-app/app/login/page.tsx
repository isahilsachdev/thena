"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "../AppContext"; // Import useAppContext
import { useRouter } from "next/navigation"; // Import useRouter
import { loginUser } from "../api";
import { toast } from "react-toastify";

export default function Login() {
  useEffect(() => {
    localStorage.removeItem('token'); // Remove token from local storage
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { setToken } = useAppContext(); // Get setToken from context
  const router = useRouter(); // Initialize router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      const { session } = response.data; // Get session token from response
      localStorage.setItem('token', session); // Save token in local storage
      console.log('first', session);
      setToken(session); // Update context with token
      toast.success('Login successful!');
      router.push('/'); // Redirect to homepage
    } catch (err) {
      toast.error(err.response.data.message || 'Something went wrong, Please try again!');
      console.error(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 flex flex-col items-center gap-8 bg-[#1B1D1E] text-white">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-lg bg-[#2A2C2E] p-6 rounded-lg">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border-1 border-white text-white p-2 rounded w-full text-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border-1 border-white text-white p-2 rounded w-full text-black"
            required
          />
        </div>
        <button type="submit" className="bg-[#1B1D1E] p-2 rounded text-white hover:opacity-[0.8] transition">
          Login
        </button>
        <p>
          Don&apos;t have an account? <a className="text-blue-400" href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}
