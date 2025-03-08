"use client";

import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("Xatolik: " + error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        alert(
          "Foydalanuvchi ma'lumotlarini tekshirishda xatolik: " +
            fetchError.message
        );
        setLoading(false);
        return;
      }

      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            name,
            email,
            token: data.user.id,
            role: "user",
            password,
          },
        ]);

        if (insertError) {
          alert("Foydalanuvchi qo‘shishda xatolik: " + insertError.message);
          setLoading(false);
          return;
        }
      }

      alert(
        "Ro‘yxatdan o‘tish muvaffaqiyatli! Iltimos, emailingizni tasdiqlang."
      );
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
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
            {loading ? "Processing..." : "Register"}
          </button>
          <h1 className="text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">
              Login
            </a>
          </h1>
        </form>
      </div>
    </div>
  );
}
