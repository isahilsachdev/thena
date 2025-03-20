"use client";

import React, { useState } from "react";
import { registerUser } from "../api";
import { useAppContext } from "../AppContext"; // Import useAppContext
import { useRouter } from "next/navigation"; // Import useRouter
import { toast } from "react-toastify";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter(); // Initialize router
  const { setToken } = useAppContext(); // Get setToken from context

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      const { session } = response.data; // Get session token from response
      localStorage.setItem('token', session); // Save token in local storage
      setToken(session); // Update context with token
      toast.success('Signup successful!');
      router.push('/'); // Redirect to homepage
    } catch (err) {
      toast.error(err.response.data.message || 'Something went wrong, Please try again!');
      console.error(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 flex flex-col items-center gap-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Signup</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-lg bg-gray-800 p-6 rounded-lg">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border-1 border-white text-white p-2 rounded w-full text-black"
            required
          />
        </div>
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
        <button type="submit" className="bg-blue-500 p-2 rounded text-white hover:bg-blue-600 transition">
          Signup
        </button>
        <p>
          Already have an account? <a className="text-blue-400" href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
