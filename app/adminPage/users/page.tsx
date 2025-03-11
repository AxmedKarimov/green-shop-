"use client";
import { useEffect, useState } from "react";
import Sidebar from "../saidbar";
import { createClient } from "@/supabase/client";

interface User {
  id: number;
  name: string;
  email: string;
  user: string;
  password: string;
  role: string;
  image?: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const { data, error } = await supabase.from("users").select("*");
        if (error) {
          throw new Error(error.message); // Throw an error if something goes wrong
        }
        setUsers(data as User[]);
      } catch (err: any) {
        setError("Error fetching users: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array to ensure this runs only once when the component mounts

  return (
    <div className="w-full flex items-center h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Body */}
      <div className="h-full w-full bg-slate-100 p-10 overflow-auto">
        <div className="h-full w-full bg-white rounded-lg p-10 shadow-sm">
          <h1 className="text-4xl font-semibold mb-10">Users</h1>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
              {error}
            </div>
          )}

          {/* Loading Indicator */}
          {loading ? (
            <p className="text-center text-xl text-gray-600">
              Loading users...
            </p>
          ) : (
            // Table for users data
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-green-300 shadow-sm">
                <thead className="bg-green-200">
                  <tr>
                    <th className="border p-3">ID</th>
                    <th className="border p-3">Name</th>
                    <th className="border p-3">Email</th>
                    <th className="border p-3">Password</th>
                    <th className="border p-3">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-green-50 transition-colors"
                    >
                      <td className="border p-3 text-center">{user.id}</td>
                      <td className="border p-3">{user.name}</td>
                      <td className="border p-3">{user.email}</td>
                      <td className="border p-3">{user.password}</td>
                      <td className="border p-3">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
