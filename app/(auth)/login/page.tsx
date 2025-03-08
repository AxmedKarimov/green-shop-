"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { createClient } from "@/supabase/client";

export default function Login() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Email yoki parol noto‘g‘ri!");
      setLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, name, role, token")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      setErrorMsg("Foydalanuvchi topilmadi!");
      setLoading(false);
      return;
    }

    localStorage.setItem("user_id", userData.id);
    localStorage.setItem("user_name", userData.name);
    localStorage.setItem("user_role", userData.role);
    localStorage.setItem("user_token", userData.token);

    if (userData.role === "admin") {
      router.push("/adminPage");
    } else if (userData.role === "user") {
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">Login</h2>
        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {loading ? "Processing..." : "Login"}
          </button>
          <h1 className="text-center text-xl">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500">
              Register
            </a>
          </h1>
        </form>
      </div>
    </div>
  );
}
